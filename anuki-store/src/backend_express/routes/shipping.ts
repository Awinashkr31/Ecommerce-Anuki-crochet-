import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';
import { createShiprocketOrder } from '../lib/shiprocket';

const router = Router();
import { prisma } from '../lib/prisma';

// GET all shipments from real orders
router.get('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT']), async (req: any, res: any) => {
  try {
    const shipments = await prisma.shipment.findMany({
      include: {
        order: {
          select: {
            id: true,
            status: true,
            totalAmount: true,
            internalNotes: true,
            createdAt: true,
            user: { select: { fullName: true, email: true, phone: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const mapped = shipments.map((s: any) => {
      let customerName = s.order?.user?.fullName || 'Customer';
      let destination = 'India';
      if (!s.order?.user?.fullName && s.order?.internalNotes) {
        const nameMatch = s.order.internalNotes.match(/Name:\s*([^,\n]+)/i);
        if (nameMatch) customerName = nameMatch[1].trim();
        const cityMatch = s.order.internalNotes.match(/,\s*([^,]+),\s*([^,-]+)\s*-\s*\d{6}/i);
        if (cityMatch) destination = `${cityMatch[1].trim()}, ${cityMatch[2].trim()}`;
      }

      return {
        id: s.orderId ? `ORD-${s.orderId.slice(-8).toUpperCase()}` : s.id,
        orderId: s.orderId,
        awb: s.awbNumber,
        courier: s.courierName,
        trackingUrl: s.trackingUrl,
        status: s.status,
        expectedDelivery: null,
        customer: customerName,
        destination,
        createdAt: s.createdAt
      };
    });

    return res.json(mapped);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

router.post('/create', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT']), async (req: any, res: any) => {
  try {
    const body = req.body;
    const { orderId } = body;

    // Fetch order from DB
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, payment: true }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Format payload for Shiprocket
    const shiprocketPayload = {
      order_id: order.id,
      order_date: order.createdAt.toISOString().slice(0, 10),
      pickup_location: "Primary",
      billing_customer_name: "Customer", // This would come from a proper address model in a full app
      billing_last_name: "",
      billing_address: "Address Line 1",
      billing_city: "City",
      billing_pincode: "110001",
      billing_state: "State",
      billing_country: "India",
      billing_email: "support@anukicrochet.in",
      billing_phone: "9999999999",
      shipping_is_billing: true,
      order_items: order.items.map((item: any) => ({
        name: `Product ${item.variantId}`, // Simplified for now
        sku: `SKU-${item.variantId}`,
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: order.payment?.status === 'SUCCESS' ? 'Prepaid' : 'COD',
      sub_total: order.totalAmount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5
    };

    const shiprocketResponse = await createShiprocketOrder(shiprocketPayload);

    // Update internal order with Shiprocket Order ID and AWB (if generated)
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PROCESSING',
        shipment: {
          create: {
            awbNumber: shiprocketResponse.awb_code || `AWB-${Date.now()}`,
            courierName: 'Shiprocket',
            status: 'LABEL_CREATED'
          }
        }
      }
    });

    return res.json({ success: true, shiprocketResponse });
  } catch (error: any) {
    console.error('Shipping Error:', error.response?.data || error);
    return res.status(500).json({ error: 'Failed to push order to shipping provider' });
  }
});

export default router;
