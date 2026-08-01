/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import { z } from 'zod';
import { verifyToken, requireRoles } from '../middleware/auth';
import { validate } from '../middleware/validation';
const router = Router();
import { prisma } from '../lib/prisma';
import { NotificationService } from '../services/notification';
import { PaymentService } from '../services/paymentService';
import redisClient from '../lib/redis';

const ADMIN_ORDERS_ANALYTICS_CACHE_KEY = 'admin_orders_analytics';

// ── Zod Schemas ──────────────────────────────────
const orderItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().positive().max(100),
  price: z.number().positive(),
  customization: z.string().max(500).optional(),
});

const addressSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  phone: z.string().min(10).max(15),
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  pincode: z.string().min(5).max(10),
  country: z.string().max(50).optional(),
});

const createOrderSchema = z.object({
  userId: z.string(),
  items: z.array(orderItemSchema).min(1).max(50),
  address: addressSchema,
  totalAmount: z.number().positive(),
  paymentMethod: z.string().transform(v => v.toLowerCase()),
  couponCode: z.string().max(30).optional(),
  discountAmount: z.number().min(0).optional(),
  redeemPoints: z.number().int().min(0).optional(),
});

async function awardLoyaltyPoints(orderId: string, tx: any = prisma) {
  const order = await tx.order.findUnique({ where: { id: orderId } });
  if (order && order.userId && order.status === 'DELIVERED') {
    const existingTx = await tx.rewardTransaction.findFirst({
      where: { orderId: order.id, type: 'EARNED' }
    });
    if (!existingTx) {
      const points = Math.floor(order.totalAmount / 100); // 1% back
      if (points > 0) {
        await tx.user.update({
          where: { id: order.userId },
          data: { pointsBalance: { increment: points } }
        });
        await tx.rewardTransaction.create({
          data: {
            userId: order.userId,
            orderId: order.id,
            points,
            type: 'EARNED',
            description: `Earned for order ${order.id.slice(-8).toUpperCase()}`
          }
        });
      }
    }
  }
}

// POST new order (Checkout)
router.post('/', verifyToken, validate(createOrderSchema), async (req: import('express').Request | any, res: import('express').Response | any) => {
  try {
    const body = req.body;
    const { items, address, totalAmount, paymentMethod, couponCode, discountAmount = 0, redeemPoints = 0 } = body;
    
    // In a real scenario, we'd calculate totalAmount securely here by fetching variant prices from DB
    // rather than trusting the client's totalAmount.

    // Using Prisma Transaction for safety
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Verify and deduct stock for each item
      for (const item of items) {
        let variant: any = await tx.variant.findUnique({
          where: { id: item.variantId },
          include: { product: true }
        });
        
        if (!variant) {
          // Check if it's a base product (frontend might send productId if no variants exist)
          const product = await tx.product.findUnique({ where: { id: item.variantId } });
          if (product) {
            // Find or create a base variant
            variant = await tx.variant.findFirst({ where: { productId: product.id, sku: `${product.id.slice(0, 8)}-base` }, include: { product: true } });
            if (!variant) {
              const baseVariant = await tx.variant.create({
                data: {
                  productId: product.id,
                  sku: `${product.id.slice(0, 8)}-base`,
                  price: product.salePrice || product.basePrice,
                  stock: product.stock,
                  color: product.color,
                  size: product.size,
                  material: product.material || null,
                }
              });
              variant = { ...baseVariant, product };
            }
            item.variantId = variant.id; // Update payload for OrderItem creation
          } else {
            throw new Error(`Variant not found: ${item.variantId}`);
          }
        }
        
        // If not made to order, ensure stock is sufficient and deduct
        if (!variant.product.isMadeToOrder) {
          if (variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${variant.product.name}`);
          }
          
          await tx.variant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }

      // Validate and increment coupon if provided
      let appliedCouponId = null;
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: couponCode } });
        if (coupon && (coupon.status === 'ACTIVE' || coupon.isActive)) {
          if ((!coupon.validTo || new Date() <= new Date(coupon.validTo)) && (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)) {
            await tx.coupon.update({
              where: { code: couponCode },
              data: { usedCount: { increment: 1 } }
            });
            appliedCouponId = coupon.id;
          }
        }
      }

      // 2. Create the Order
      const order = await tx.order.create({
        data: {
          userId: req.user.userId,
          totalAmount,
          status: paymentMethod === 'cod' ? 'PENDING' : 'AWAITING_PAYMENT',
          internalNotes: address ? `Shipping Address: ${address.firstName} ${address.lastName}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode}, Phone: ${address.phone || 'N/A'}` : null,
          items: {
            create: items.map((item: any) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
              customization: item.customization || null
            }))
          },
        },
        include: { items: true, payment: true }
      });
      
      // 3. Create CouponUsage if applicable
      if (appliedCouponId) {
        await tx.couponUsage.create({
          data: {
            userId: req.user.userId,
            orderId: order.id,
            couponId: appliedCouponId,
            discountAmount: discountAmount,
            orderTotal: totalAmount,
            ipAddress: req.ip || null
          }
        });
      }

      // 4. Redeem Points if any
      if (redeemPoints > 0) {
        const user = await tx.user.findUnique({ where: { id: req.user.userId } });
        if (!user || user.pointsBalance < redeemPoints) {
          throw new Error('Insufficient points balance');
        }
        await tx.user.update({
          where: { id: req.user.userId },
          data: { pointsBalance: { decrement: redeemPoints } }
        });
        await tx.rewardTransaction.create({
          data: {
            userId: req.user.userId,
            orderId: order.id,
            points: redeemPoints,
            type: 'REDEEMED',
            description: `Redeemed for order ${order.id.slice(-8).toUpperCase()}`
          }
        });
      }
      
      return order;
    }, {
      maxWait: 10000,
      timeout: 20000
    });

    // Handle COD payment via PaymentService (outside transaction)
    if (paymentMethod === 'cod') {
      await PaymentService.createCodPayment(result.id, totalAmount, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
      await prisma.order.update({
        where: { id: result.id },
        data: { status: 'PROCESSING' }
      });
      result.status = 'PROCESSING' as any;
    }

    let paymentSessionId = undefined;
    let cashfreeOrderId = undefined;
    if (paymentMethod === 'online') {
      const user = await prisma.user.findUnique({ where: { id: result.userId || '' } });
      const paymentResult = await PaymentService.initiatePayment(
        result.id,
        totalAmount,
        {
          id: result.userId || 'guest',
          email: user?.email || '',
          phone: address.phone,
          name: `${address.firstName || ''} ${address.lastName || ''}`.trim(),
        },
        {
          ipAddress: req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown',
          userAgent: req.headers['user-agent'] || '',
        }
      );
      paymentSessionId = paymentResult.payment_session_id;
      cashfreeOrderId = paymentResult.order_id;
    }

    // Fire notifications AFTER transaction succeeds
    // Notify Customer
    if (result.userId) {
      NotificationService.send({
        userId: result.userId,
        role: 'customer',
        title: 'Order Placed Successfully',
        message: `Thank you for your order! Your order ID is ${result.id.slice(-8).toUpperCase()}.`,
        category: 'orders',
        priority: 'high',
        actionUrl: `/account`
      }).catch(console.error);
    }

    // Notify Admins
    NotificationService.sendAdminAlert({
      title: 'New Order Received',
      message: `A new order of ₹${totalAmount} has been placed.`,
      category: 'orders',
      priority: 'high',
      actionUrl: `/admin/orders/${result.id}`
    }).catch(console.error);

    return res.status(201).json({
      ...result,
      payment_session_id: paymentSessionId,
      cashfree_order_id: cashfreeOrderId
    });
  } catch (error: unknown) {
    console.error("Order creation failed:", (error as Error).message);
    const msg = (error as Error).message && !(error as Error).message.includes('\n') ? (error as Error).message : 'Failed to create order. Please try again.';
    return res.status(400).json({ error: msg });
  }
});
// GET my orders analytics (Customer)
router.get('/my-orders/analytics', verifyToken, async (req: import('express').Request | any, res: import('express').Response | any) => {
  try {
    const userId = req.user.userId;
    const [
      totalOrders,
      activeOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrders,
      revenueData
    ] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.count({ where: { userId, status: { in: ['PENDING', 'PROCESSING', 'SHIPPED'] } } }),
      prisma.order.count({ where: { userId, status: 'DELIVERED' } }),
      prisma.order.count({ where: { userId, status: 'CANCELLED' } }),
      prisma.order.count({ where: { userId, items: { some: { returnRequest: { isNot: null } } } } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { userId, status: { not: 'CANCELLED' } } })
    ]);

    const couponUsages = await prisma.couponUsage.aggregate({
      _sum: { discountAmount: true },
      where: { userId }
    });

    return res.json({
      totalOrders,
      activeOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrders,
      totalSpent: revenueData._sum.totalAmount || 0,
      totalSaved: couponUsages._sum.discountAmount || 0
    });
  } catch (error: unknown) {
    console.error("Failed to fetch my orders analytics:", (error as Error).message);
    return res.status(400).json({ error: 'Failed to fetch analytics' });
  }
});

// GET my orders (Customer)
router.get('/my-orders', verifyToken, async (req: import('express').Request | any, res: import('express').Response | any) => {
  try {
    const userId = req.user.userId;
    const { status, timeRange, search } = req.query;

    const whereClause: any = { userId };

    if (status && status !== 'ALL') {
      if (status === 'ACTIVE') {
        whereClause.status = { in: ['PENDING', 'PROCESSING', 'SHIPPED'] };
      } else {
        whereClause.status = status;
      }
    }

    if (timeRange) {
      const now = new Date();
      if (timeRange === '30DAYS') {
        whereClause.createdAt = { gte: new Date(now.setDate(now.getDate() - 30)) };
      } else if (timeRange === '6MONTHS') {
        whereClause.createdAt = { gte: new Date(now.setMonth(now.getMonth() - 6)) };
      } else if (timeRange === '1YEAR') {
        whereClause.createdAt = { gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
      }
    }

    if (search) {
      whereClause.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { items: { some: { variant: { product: { name: { contains: search, mode: 'insensitive' } } } } } },
        { shipment: { trackingUrl: { contains: search, mode: 'insensitive' } } },
        { shipment: { awbNumber: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            returnRequest: true,
            variant: {
              include: { 
                product: {
                  select: { 
                    id: true, 
                    name: true, 
                    slug: true, 
                    images: { take: 1, select: { url: true, altText: true } } 
                  }
                } 
              }
            }
          }
        },
        user: {
          select: { fullName: true, email: true, phone: true }
        },
        payment: true,
        shipment: true,
        couponUsages: true,
        timeline: { orderBy: { createdAt: 'desc' } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(orders);
  } catch (error: unknown) {
    console.error("Failed to fetch my orders:", (error as Error).message);
    return res.status(400).json({ error: 'Failed to fetch your orders' });
  }
});

// POST cancel order (Customer)
router.post('/:id/cancel', verifyToken, async (req: import('express').Request | any, res: import('express').Response | any) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const order = await prisma.order.findUnique({ where: { id, userId } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage' });
    }

    await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    await prisma.orderTimeline.create({
      data: {
        orderId: id,
        status: 'CANCELLED',
        note: 'Order cancelled by customer'
      }
    });

    return res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error: unknown) {
    console.error("Failed to cancel order:", (error as Error).message);
    return res.status(400).json({ error: 'Failed to cancel order' });
  }
});

// GET order analytics (Admin)
router.get('/analytics', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT', 'FINANCE']), async (req: import('express').Request | any, res: import('express').Response | any) => {
  try {
    if (redisClient.isReady) {
      const cached = await redisClient.get(ADMIN_ORDERS_ANALYTICS_CACHE_KEY);
      if (cached) return res.json(JSON.parse(cached));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrders,
      failedOrders,
      totalRevenueData
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { status: 'SHIPPED' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
      prisma.order.count({ where: { items: { some: { returnRequest: { isNot: null } } } } }),
      prisma.order.count({ where: { payment: { status: 'FAILED' } } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { not: 'CANCELLED' } } })
    ]);

    const totalRevenue = totalRevenueData._sum.totalAmount || 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const result = {
      totalOrders,
      todayOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrders,
      failedOrders,
      totalRevenue,
      avgOrderValue
    };

    if (redisClient.isReady) {
      await redisClient.setEx(ADMIN_ORDERS_ANALYTICS_CACHE_KEY, 300, JSON.stringify(result));
    }

    return res.json(result);
  } catch (error: unknown) {
    return res.status(400).json({ error: 'Failed to fetch analytics' });
  }
});

// GET order by id (Admin/Customer)
router.get('/:id', verifyToken, async (req: import('express').Request | any, res: import('express').Response | any) => {
  try {
    const { id } = req.params;
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { fullName: true, email: true, phone: true } },
        items: {
          include: {
            variant: {
              include: { product: { select: { name: true, images: true } } }
            }
          }
        },
        payment: true,
        shipment: true,
        timeline: {
          include: { user: { select: { fullName: true, role: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const userRole = req.user.role;
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN' && userRole !== 'ORDER_FULFILLMENT' && userRole !== 'CUSTOMER_SUPPORT') {
      if (order.userId !== req.user.userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    // Customer aggregate stats
    let totalLifetimeSpend = 0;
    let totalOrdersCount = 0;
    
    if (order.userId && (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN')) {
      const stats = await prisma.order.aggregate({
        where: { userId: order.userId, status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true },
        _count: { id: true }
      });
      totalLifetimeSpend = stats._sum.totalAmount || 0;
      totalOrdersCount = stats._count.id || 0;
    }

    // Filter timeline for customer
    let filteredTimeline = order.timeline;
    if (userRole === 'CUSTOMER') {
      filteredTimeline = order.timeline.filter((t: any) => !t.isInternal);
    }

    const mappedOrder = {
      ...order,
      user: order.user ? { name: order.user.fullName, email: order.user.email, phone: order.user.phone } : null,
      timeline: filteredTimeline.map((t: any) => ({
        ...t,
        user: t.user ? { name: t.user.fullName, role: t.user.role } : null
      })),
      customerStats: {
        totalLifetimeSpend,
        totalOrdersCount
      }
    };

    return res.json(mappedOrder);
  } catch (error: unknown) {
    return res.status(400).json({ error: 'Failed to fetch order' });
  }
});

// GET all orders (Admin) with Pagination & Filtering
router.get('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT', 'CUSTOMER_SUPPORT', 'FINANCE']), async (req: import('express').Request | any, res: import('express').Response | any) => {
  try {
    const { page = 1, limit = 50, status, search, paymentStatus } = req.query;
    
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.payment = { status: paymentStatus };
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { user: { fullName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limitNumber,
        include: {
          user: { select: { fullName: true, email: true } },
          payment: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    return res.json({
      orders,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error: unknown) {
    return res.status(400).json({ error: 'Failed to fetch orders' });
  }
});

// PUT update order status (Admin)
router.put('/:id/status', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT']), async (req: import('express').Request | any, res: import('express').Response | any) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const { status, note } = body;
    
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    if (status === 'DELIVERED') {
      await awardLoyaltyPoints(id);
    }

    // Create a timeline log for this status change
    await prisma.orderTimeline.create({
      data: {
        orderId: id,
        status,
        note: note || `Status changed to ${status}`,
        userId: req.user.userId
      }
    });
    
    // Notify customer about status change
    if (order.userId) {
      NotificationService.send({
        userId: order.userId,
        role: 'customer',
        title: `Order Status Updated: ${status}`,
        message: `Your order is now ${status}. ${note || ''}`,
        category: 'orders',
        priority: 'medium',
        actionUrl: `/account`
      }).catch(console.error);
    }

    return res.json(order);
  } catch (error: unknown) {
    return res.status(400).json({ error: 'Failed to update order status' });
  }
});

// POST create order timeline note (Admin)
router.post('/:id/notes', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT', 'CUSTOMER_SUPPORT']), async (req: import('express').Request | any, res: import('express').Response | any) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const { note, isInternal } = body;
    
    const timeline = await prisma.orderTimeline.create({
      data: {
        orderId: id,
        status: isInternal ? 'INTERNAL_NOTE' : 'NOTE',
        note,
        isInternal: isInternal ?? true,
        type: 'NOTE',
        userId: req.user.userId
      },
      include: { user: { select: { fullName: true, role: true } } }
    });
    
    return res.json(timeline);
  } catch (error: unknown) {
    return res.status(400).json({ error: 'Failed to add note' });
  }
});

// POST trigger communication (Admin)
router.post('/:id/communication', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT', 'CUSTOMER_SUPPORT']), async (req: import('express').Request | any, res: import('express').Response | any) => {
  try {
    const { id } = req.params;
    const { channel, message, title } = req.body; // e.g. channel: email, sms, whatsapp

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order || !order.userId) return res.status(400).json({ error: 'Order or User not found' });

    // Send notification
    await NotificationService.send({
      userId: order.userId as string,
      role: 'customer',
      title: title || 'Message regarding your order',
      message: message,
      category: 'orders',
      priority: 'high',
      channel: channel || 'all',
      actionUrl: `/account`
    });

    // Log to timeline
    await prisma.orderTimeline.create({
      data: {
        orderId: id,
        status: `COMMUNICATION_SENT`,
        note: `Sent via ${channel || 'all'}: ${message}`,
        isInternal: true,
        type: 'COMMUNICATION',
        userId: req.user.userId
      }
    });

    return res.json({ success: true });
  } catch (error: unknown) {
    return res.status(400).json({ error: 'Failed to send communication' });
  }
});

// PUT update internal notes
router.put('/:id/notes', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT']), async (req: import('express').Request | any, res: import('express').Response | any) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const { internalNotes } = body;
    
    const order = await prisma.order.update({
      where: { id },
      data: { internalNotes }
    });
    
    return res.json(order);
  } catch (error: unknown) {
    return res.status(400).json({ error: 'Failed to update internal notes' });
  }
});

// GET order timeline
router.get('/:id/timeline', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT', 'CUSTOMER_SUPPORT']), async (req: import('express').Request | any, res: import('express').Response | any) => {
  try {
    const { id } = req.params;
    const timeline = await prisma.orderTimeline.findMany({
      where: { orderId: id },
      include: { user: { select: { fullName: true, role: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(timeline);
  } catch (error: unknown) {
    return res.status(400).json({ error: 'Failed to fetch timeline' });
  }
});

import { ShippingService } from '../services/shipping';

// POST fulfill order (Generate Label) (Admin only)
router.post('/:id/fulfill', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT']), async (req: import('express').Request | any, res: import('express').Response | any) => {
  try {
    const { id } = req.params;
    
    // Check if order exists and is not already shipped
    const order = await prisma.order.findUnique({ where: { id }, include: { shipment: true } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.shipment) return res.status(400).json({ error: 'Order already has a shipment' });
    
    const shipment = await ShippingService.generateLabel(id);
    
    // Notify customer
    if (order.userId) {
      NotificationService.send({
        userId: order.userId,
        role: 'customer',
        title: 'Order Shipped',
        message: `Your order has been shipped via ${shipment.courierName}. Tracking: ${shipment.awbNumber}`,
        category: 'orders',
        priority: 'high',
        actionUrl: `/account`
      }).catch(console.error);
    }

    return res.json(shipment);
  } catch (error: unknown) {
    return res.status(400).json({ error: 'Failed to fulfill order' });
  }
});

// POST mock shipping webhook
router.post('/webhooks/shipping', async (req: import('express').Request | any, res: import('express').Response | any) => {
  try {
    const body = req.body;
    const { awbNumber, status } = body; // e.g., 'OUT_FOR_DELIVERY', 'DELIVERED'
    
    const shipment = await prisma.shipment.update({
      where: { awbNumber },
      data: { status }
    });

    // If delivered, update order status too
    if (status === 'DELIVERED') {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: { status: 'DELIVERED' }
      });
      await awardLoyaltyPoints(shipment.orderId);
    }

    return res.json({ success: true });
  } catch (error: unknown) {
    return res.status(400).json({ error: 'Failed to process webhook' });
  }
});

// DELETE order
router.delete('/:id', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN']), async (req: import('express').Request | any, res: import('express').Response | any) => {
  try {
    const { id } = req.params;
    
    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        timeline: true,
        payment: true,
        shipment: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Since items are related, and there might be FK constraints, we delete in a transaction or let onDelete: Cascade handle it.
    // Assuming Cascade is NOT set for everything, let's delete explicitly if needed, but we can try a direct delete first if Cascade is configured.
    // Wait, OrderItem has Order relation. OrderTimeline has Order relation. Shipment has Order relation. Payment has Order relation.
    
    await prisma.$transaction(async (tx: any) => {
      await tx.orderTimeline.deleteMany({ where: { orderId: id } });
      await tx.payment.deleteMany({ where: { orderId: id } });
      await tx.shipment.deleteMany({ where: { orderId: id } });
      
      // Delete order items (and their return requests if any)
      const items = await tx.orderItem.findMany({ where: { orderId: id } });
      for (const item of items) {
        await tx.returnRequest.deleteMany({ where: { orderItemId: item.id } });
      }
      await tx.orderItem.deleteMany({ where: { orderId: id } });
      
      await tx.couponUsage.deleteMany({ where: { orderId: id } });

      await tx.order.delete({ where: { id } });
    });

    return res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete order error:', error);
    return res.status(400).json({ error: 'Failed to delete order' });
  }
});

export default router;
