import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { sendOrderConfirmationEmail } from '../lib/email';

dotenv.config();

const router = Router();
import { prisma } from '../lib/prisma';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_TIFdGVUKCE4VcF',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'b7KRuP8aWzo18jwy17iSZ22I',
});

// Create Order
router.post('/create-order', async (req: any, res: any) => {
  try {
    const body = req.body;
    const { amount, currency = 'INR', internalOrderId } = body;

    const options = {
      amount: Math.round(amount * 100), // Razorpay works in paise, ensure integer
      currency,
      receipt: `rcpt_${internalOrderId}`.substring(0, 40)
    };

    const order = await razorpay.orders.create(options);
    return res.json(order);
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    return res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// Verify Payment
router.post('/verify', async (req: any, res: any) => {
  try {
    const body = req.body;
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      internalOrderId 
    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'b7KRuP8aWzo18jwy17iSZ22I';

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      const existingOrder = await prisma.order.findUnique({ where: { id: internalOrderId } });
      const paymentAmount = existingOrder ? existingOrder.totalAmount : 0;

      // Payment successful, update internal order status
      const updatedOrder = await prisma.order.update({
        where: { id: internalOrderId },
        data: { 
          status: 'PROCESSING',
          payment: {
            create: {
              gateway: 'RAZORPAY',
              transactionId: razorpay_payment_id,
              status: 'PAID',
              amount: paymentAmount
            }
          }
        },
        include: { user: true }
      });

      // Send Confirmation Email
      // Fallback email if user is guest or missing email
      const customerEmail = updatedOrder.user?.email || 'support@anukicrochet.in';
      await sendOrderConfirmationEmail(customerEmail, updatedOrder.id, updatedOrder.totalAmount);
      
      return res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      // Payment signature mismatch
      await prisma.order.update({
        where: { id: internalOrderId },
        data: { 
          payment: {
            create: {
              gateway: 'RAZORPAY',
              transactionId: razorpay_payment_id || 'failed_' + Date.now(),
              status: 'FAILED',
              amount: 0 // Fetching logic could also be applied here if needed
            }
          }
        }
      });

      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    return res.status(500).json({ error: 'Failed to verify payment' });
  }
});

export default router;
