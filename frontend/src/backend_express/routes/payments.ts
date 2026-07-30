import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';
import { PaymentService, PaymentMeta } from '../services/paymentService';

const router = Router();

// ──────────────────────────────────────────────────
// Helper: extract metadata from request
// ──────────────────────────────────────────────────
function extractMeta(req: any): PaymentMeta {
  const ua = req.headers['user-agent'] || '';
  return {
    ipAddress: req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown',
    userAgent: ua,
    sessionId: req.headers['x-session-id']?.toString() || req.body?.sessionId,
    device: /Mobile|Android|iPhone/i.test(ua) ? 'mobile' : 'desktop',
    browser: ua.match(/(Chrome|Firefox|Safari|Edge|Opera)/i)?.[1] || 'unknown',
    os: ua.match(/(Windows|Mac|Linux|Android|iOS)/i)?.[1] || 'unknown',
  };
}

// ──────────────────────────────────────────────────
// POST /cashfree/create-order
// Creates a Cashfree payment session (idempotent)
// ──────────────────────────────────────────────────
router.post('/cashfree/create-order', verifyToken, async (req: any, res: any) => {
  try {
    const { amount, internalOrderId, user } = req.body;
    const meta = extractMeta(req);

    if (!amount || !internalOrderId) {
      return res.status(400).json({ error: 'Missing required fields: amount, internalOrderId' });
    }

    const result = await PaymentService.initiatePayment(
      internalOrderId,
      amount,
      {
        id: user?.id || req.user?.userId || 'guest',
        email: user?.email,
        phone: user?.phone,
        name: user?.name || user?.fullName,
      },
      meta
    );

    if (result.alreadyPaid) {
      return res.json({
        alreadyPaid: true,
        message: 'Payment already completed for this order.',
        payment_session_id: null,
        order_id: null,
      });
    }

    return res.json({
      payment_session_id: result.payment_session_id,
      order_id: result.order_id,
      paymentId: result.payment.id,
      retryCount: result.payment.retryCount,
    });
  } catch (error: any) {
    console.error('Cashfree Create Order Error:', error?.response?.data || error.message);
    return res.status(500).json({ error: error.message || 'Failed to create payment order' });
  }
});

// ──────────────────────────────────────────────────
// POST /cashfree/verify
// Verifies payment status from gateway (idempotent)
// ──────────────────────────────────────────────────
router.post('/cashfree/verify', verifyToken, async (req: any, res: any) => {
  try {
    const { order_id, internalOrderId } = req.body;
    const meta = extractMeta(req);

    if (!order_id || !internalOrderId) {
      return res.status(400).json({ error: 'Missing required fields: order_id, internalOrderId' });
    }

    const result = await PaymentService.verifyPayment(internalOrderId, order_id, meta);

    if (result.success) {
      return res.json(result);
    }

    if ('pending' in result && result.pending) {
      return res.json(result);
    }

    return res.status(400).json(result);
  } catch (error: any) {
    console.error('Cashfree Verify Error:', error?.response?.data || error.message);
    return res.status(500).json({ error: error.message || 'Failed to verify payment' });
  }
});

// ──────────────────────────────────────────────────
// POST /retry
// Retry a failed/dropped/cancelled payment
// ──────────────────────────────────────────────────
router.post('/retry', verifyToken, async (req: any, res: any) => {
  try {
    const { orderId } = req.body;
    const meta = extractMeta(req);

    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId' });
    }

    const result = await PaymentService.retryPayment(
      orderId,
      {
        id: req.user?.userId || 'guest',
        email: req.body.user?.email,
        phone: req.body.user?.phone,
        name: req.body.user?.name,
      },
      meta
    );

    return res.json({
      payment_session_id: result.payment_session_id,
      order_id: result.order_id,
      retryCount: result.payment.retryCount,
    });
  } catch (error: any) {
    console.error('Retry Payment Error:', error.message);
    return res.status(400).json({ error: error.message || 'Failed to retry payment' });
  }
});

// ──────────────────────────────────────────────────
// GET /status/:orderId
// Get payment status + timeline (customer)
// ──────────────────────────────────────────────────
router.get('/status/:orderId', verifyToken, async (req: any, res: any) => {
  try {
    const { orderId } = req.params;
    const result = await PaymentService.getPaymentStatus(orderId);

    if (!result) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Security: ensure the requesting user owns this order
    if (result.order?.userId && result.order.userId !== req.user?.userId) {
      // Allow admins to view
      const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'ORDER_FULFILLMENT', 'FINANCE'];
      if (!adminRoles.includes(req.user?.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    return res.json(result);
  } catch (error: any) {
    console.error('Get Payment Status Error:', error.message);
    return res.status(500).json({ error: 'Failed to get payment status' });
  }
});

// ──────────────────────────────────────────────────
// GET /admin/logs/:paymentId
// Full payment logs (admin only)
// ──────────────────────────────────────────────────
router.get('/admin/logs/:paymentId', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN', 'FINANCE']), async (req: any, res: any) => {
  try {
    const logs = await PaymentService.getPaymentLogs(req.params.paymentId);
    return res.json(logs);
  } catch (error: any) {
    console.error('Get Payment Logs Error:', error.message);
    return res.status(500).json({ error: 'Failed to get payment logs' });
  }
});

// ──────────────────────────────────────────────────
// GET /admin/analytics
// Payment analytics dashboard data (admin only)
// ──────────────────────────────────────────────────
router.get('/admin/analytics', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN', 'FINANCE']), async (req: any, res: any) => {
  try {
    const { from, to } = req.query;
    const dateRange = from && to ? { from: new Date(from as string), to: new Date(to as string) } : undefined;
    const analytics = await PaymentService.getPaymentAnalytics(dateRange);
    return res.json(analytics);
  } catch (error: any) {
    console.error('Get Payment Analytics Error:', error.message);
    return res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// ──────────────────────────────────────────────────
// POST /admin/cleanup
// Cleanup expired payments & orders (admin only)
// ──────────────────────────────────────────────────
router.post('/admin/cleanup', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN']), async (req: any, res: any) => {
  try {
    const result = await PaymentService.cleanupExpiredPayments();
    return res.json({ message: `Cleaned ${result.cleaned} of ${result.total} expired payments`, ...result });
  } catch (error: any) {
    console.error('Cleanup Error:', error.message);
    return res.status(500).json({ error: 'Failed to cleanup expired payments' });
  }
});

export default router;
