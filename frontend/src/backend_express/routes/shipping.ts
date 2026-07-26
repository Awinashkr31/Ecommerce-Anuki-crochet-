import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';
import { createShiprocketOrder } from '../lib/shiprocket';

const router = Router();
import { prisma } from '../lib/prisma';

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
      payment_method: order.payment?.status === 'PAID' ? 'Prepaid' : 'COD',
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
