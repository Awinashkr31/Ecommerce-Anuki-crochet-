import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';

const router = Router();
import { prisma } from '../lib/prisma';

// POST new order (Checkout)
router.post('/', async (req: any, res: any) => {
  try {
    const body = req.body;
    const { userId, items, address, totalAmount } = body;
    
    // In a real scenario, we'd calculate totalAmount securely here by fetching variant prices from DB
    // rather than trusting the client's totalAmount.

    // Using Prisma Transaction for safety
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Verify and deduct stock for each item
      for (const item of items) {
        const variant = await tx.variant.findUnique({
          where: { id: item.variantId },
          include: { product: true }
        });
        
        if (!variant) throw new Error(`Variant not found: ${item.variantId}`);
        
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

      // 2. Create the Order
      const order = await tx.order.create({
        data: {
          userId: userId || undefined, // undefined for guest checkout if schema allows (our schema currently requires user, so we'd need to adjust or create guest users)
          totalAmount,
          status: 'PENDING',
          internalNotes: address ? `Shipping Address: ${address.firstName} ${address.lastName}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode}` : null,
          items: {
            create: items.map((item: any) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
              customization: item.customization || null
            }))
          },
          // Mock Payment creation
          payment: {
            create: {
              gateway: 'MOCK_RAZORPAY',
              transactionId: `txn_${Date.now()}`,
              status: 'SUCCESS',
              amount: totalAmount
            }
          }
        },
        include: { items: true, payment: true }
      });
      
      return order;
    });

    return res.status(201).json(result);
  } catch (error: any) {
    console.error("Order creation failed:", error.message);
    return res.status(400).json({ error: error.message || 'Failed to create order' });
  }
});

// GET all orders (Admin)
router.get('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT', 'CUSTOMER_SUPPORT', 'FINANCE']), async (req: any, res: any) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        payment: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(orders);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch orders' });
  }
});

// PUT update order status (Admin)
router.put('/:id/status', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const { status, note } = body;
    
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    // Create a timeline log for this status change
    await prisma.orderTimeline.create({
      data: {
        orderId: id,
        status,
        note: note || `Status changed to ${status}`,
        userId: req.user.userId
      }
    });
    
    return res.json(order);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to update order status' });
  }
});

// PUT update internal notes
router.put('/:id/notes', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const { internalNotes } = body;
    
    const order = await prisma.order.update({
      where: { id },
      data: { internalNotes }
    });
    
    return res.json(order);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to update internal notes' });
  }
});

// GET order timeline
router.get('/:id/timeline', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT', 'CUSTOMER_SUPPORT']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const timeline = await prisma.orderTimeline.findMany({
      where: { orderId: id },
      include: { user: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(timeline);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch timeline' });
  }
});

import { ShippingService } from '../services/shipping';

// POST fulfill order (Generate Label) (Admin only)
router.post('/:id/fulfill', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Check if order exists and is not already shipped
    const order = await prisma.order.findUnique({ where: { id }, include: { shipment: true } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.shipment) return res.status(400).json({ error: 'Order already has a shipment' });
    
    const shipment = await ShippingService.generateLabel(id);
    
    return res.json(shipment);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fulfill order' });
  }
});

// POST mock shipping webhook
router.post('/webhooks/shipping', async (req: any, res: any) => {
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
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: 'Failed to process webhook' });
  }
});

export default router;
