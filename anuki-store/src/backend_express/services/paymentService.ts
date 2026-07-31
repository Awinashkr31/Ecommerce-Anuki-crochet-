import { prisma } from '../lib/prisma';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import crypto from 'crypto';
import { NotificationService } from './notification';
import { sendOrderConfirmationEmail } from '../lib/email';

// ──────────────────────────────────────────────────
// Cashfree SDK instance
// ──────────────────────────────────────────────────
const cashfreeEnv = process.env.CASHFREE_ENVIRONMENT === 'production'
  ? CFEnvironment.PRODUCTION
  : CFEnvironment.SANDBOX;

const cashfreeClient = new Cashfree(
  cashfreeEnv,
  process.env.CASHFREE_APP_ID || '',
  process.env.CASHFREE_SECRET_KEY || ''
);

// ──────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────
export interface PaymentMeta {
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  device?: string;
  browser?: string;
  os?: string;
}

// Statuses that allow a retry
const RETRYABLE_STATUSES = ['FAILED', 'USER_DROPPED', 'TIMEOUT', 'CANCELLED', 'EXPIRED'] as const;
// Statuses where the payment is "settled" and must not be modified
const TERMINAL_SUCCESS = ['SUCCESS', 'REFUNDED', 'PARTIALLY_REFUNDED'] as const;

// ──────────────────────────────────────────────────
// PaymentService
// ──────────────────────────────────────────────────
export class PaymentService {

  // ── 1. INITIATE PAYMENT ─────────────────────────
  static async initiatePayment(
    orderId: string,
    amount: number,
    user: { id: string; email?: string; phone?: string; name?: string },
    meta: PaymentMeta = {}
  ) {
    // Check for existing payment on this order
    const existing = await prisma.payment.findUnique({ where: { orderId } });

    // If payment already succeeded, return it (duplicate protection)
    if (existing && (TERMINAL_SUCCESS as readonly string[]).includes(existing.status)) {
      return { payment: existing, alreadyPaid: true };
    }

    // If a retryable payment exists, increment retry count
    if (existing && (RETRYABLE_STATUSES as readonly string[]).includes(existing.status)) {
      if (existing.retryCount >= existing.maxRetries) {
        throw new Error('Maximum retry attempts reached. Please contact support.');
      }

      // Create a new Cashfree order for the retry
      const cfOrder = await this.createCashfreeOrder(orderId, amount, user);

      const updated = await prisma.payment.update({
        where: { id: existing.id },
        data: {
          status: 'INITIATED',
          retryCount: { increment: 1 },
          paymentIntentId: cfOrder.order_id,
          gatewayStatus: null,
          failureReason: null,
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
          sessionId: meta.sessionId,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min expiry
        }
      });

      await this.logEvent(updated.id, 'RETRY_INITIATED', `Retry #${updated.retryCount}`, meta);
      await this.logPayment(updated.id, 'RETRY', 'INITIATED', { orderId, amount }, cfOrder, meta);

      return {
        payment: updated,
        payment_session_id: cfOrder.payment_session_id,
        order_id: cfOrder.order_id,
        alreadyPaid: false,
      };
    }

    // If INITIATED or PROCESSING payment exists and is not expired, return existing session
    if (existing && ['INITIATED', 'PROCESSING', 'PENDING'].includes(existing.status)) {
      if (existing.expiresAt && new Date() < existing.expiresAt && existing.paymentIntentId) {
        // Still valid — don't create a new one
        // We need to fetch the session again since we don't store it
        // Create a new Cashfree order instead (gateway handles idempotency)
      }
      // For safety, create a fresh session
      const cfOrder = await this.createCashfreeOrder(orderId, amount, user);

      const updated = await prisma.payment.update({
        where: { id: existing.id },
        data: {
          status: 'INITIATED',
          paymentIntentId: cfOrder.order_id,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
          sessionId: meta.sessionId,
        }
      });

      await this.logEvent(updated.id, 'PAYMENT_REINITIATED', 'New payment session created', meta);

      return {
        payment: updated,
        payment_session_id: cfOrder.payment_session_id,
        order_id: cfOrder.order_id,
        alreadyPaid: false,
      };
    }

    // ── First-time payment ───────────────────────
    const cfOrder = await this.createCashfreeOrder(orderId, amount, user);

    const payment = await prisma.payment.create({
      data: {
        orderId,
        paymentIntentId: cfOrder.order_id,
        transactionId: `txn_${orderId}_${Date.now()}`, // temporary; updated on verify
        gateway: 'CASHFREE',
        amount,
        currency: 'INR',
        status: 'INITIATED',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        sessionId: meta.sessionId,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      }
    });

    await this.logEvent(payment.id, 'CHECKOUT_STARTED', 'Payment initiated', meta);
    await this.logPayment(payment.id, 'CREATE_ORDER', 'INITIATED', { orderId, amount, user: { id: user.id, email: user.email } }, cfOrder, meta);

    return {
      payment,
      payment_session_id: cfOrder.payment_session_id,
      order_id: cfOrder.order_id,
      alreadyPaid: false,
    };
  }

  // ── 2. VERIFY PAYMENT ──────────────────────────
  static async verifyPayment(orderId: string, cashfreeOrderId: string, meta: PaymentMeta = {}) {
    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: { order: { include: { user: true, items: true } } }
    });

    if (!payment) {
      throw new Error('Payment not found for this order');
    }

    // Idempotency: if already SUCCESS, return immediately
    if (payment.status === 'SUCCESS') {
      return { success: true, status: 'SUCCESS', message: 'Payment already verified', alreadyVerified: true };
    }

    // Fetch payment status from Cashfree
    let gatewayPayments: any[];
    try {
      const response = await cashfreeClient.PGOrderFetchPayments(cashfreeOrderId);
      gatewayPayments = response.data || [];
    } catch (err: any) {
      await this.logPayment(payment.id, 'VERIFY', 'GATEWAY_ERROR', { cashfreeOrderId }, err?.response?.data || err.message, meta);
      throw new Error('Failed to fetch payment status from gateway');
    }

    await this.logPayment(payment.id, 'VERIFY', 'FETCHED', { cashfreeOrderId }, { payments: gatewayPayments.map((p: any) => ({ id: p.cf_payment_id, status: p.payment_status, method: p.payment_method })) }, meta);

    // Check for successful payment
    const successfulPayment = gatewayPayments.find((p: any) => p.payment_status === 'SUCCESS');

    if (successfulPayment) {
      return await this.processSuccess(payment, successfulPayment, meta);
    }

    // Determine best non-success status
    const pendingPayment = gatewayPayments.find((p: any) => p.payment_status === 'PENDING');
    const failedPayment = gatewayPayments.find((p: any) => p.payment_status === 'FAILED');
    const droppedPayment = gatewayPayments.find((p: any) => p.payment_status === 'USER_DROPPED');
    const cancelledPayment = gatewayPayments.find((p: any) => p.payment_status === 'CANCELLED');
    const notAttempted = gatewayPayments.find((p: any) => p.payment_status === 'NOT_ATTEMPTED');

    const relevantPayment = pendingPayment || failedPayment || droppedPayment || cancelledPayment || notAttempted || gatewayPayments[0];
    const gatewayStatus = relevantPayment?.payment_status || 'FAILED';

    // Map gateway status to our PaymentStatus enum
    let mappedStatus: string;
    let failureReason: string | null = null;

    switch (gatewayStatus) {
      case 'PENDING':
        mappedStatus = 'PENDING';
        break;
      case 'USER_DROPPED':
        mappedStatus = 'USER_DROPPED';
        failureReason = 'Payment was interrupted. Customer left the payment page.';
        break;
      case 'CANCELLED':
        mappedStatus = 'CANCELLED';
        failureReason = 'Payment was cancelled by the customer.';
        break;
      case 'NOT_ATTEMPTED':
        mappedStatus = 'USER_DROPPED';
        failureReason = 'Payment was not attempted.';
        break;
      default:
        mappedStatus = 'FAILED';
        failureReason = relevantPayment?.payment_message || 'Payment failed. Please try again.';
    }

    // Update payment record
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: mappedStatus as any,
        gatewayStatus,
        failureReason,
        transactionId: relevantPayment?.cf_payment_id?.toString() || payment.transactionId,
        paymentMethod: relevantPayment?.payment_method ? (typeof relevantPayment.payment_method === 'object' ? Object.keys(relevantPayment.payment_method)[0] : String(relevantPayment.payment_method)) : null,
      }
    });

    await this.logEvent(payment.id, `PAYMENT_${mappedStatus}`, failureReason || `Payment status: ${gatewayStatus}`, meta);

    // Send notifications for failures
    if (['FAILED', 'USER_DROPPED', 'CANCELLED'].includes(mappedStatus)) {
      await this.sendFailureNotifications(payment, mappedStatus, failureReason);
    }

    if (mappedStatus === 'PENDING') {
      return {
        success: false,
        pending: true,
        status: 'PENDING',
        message: 'Payment is pending. Waiting for bank confirmation.',
        retryAllowed: false,
      };
    }

    return {
      success: false,
      status: mappedStatus,
      message: failureReason || 'Payment was not successful.',
      retryAllowed: (RETRYABLE_STATUSES as readonly string[]).includes(mappedStatus),
      retryCount: payment.retryCount,
      maxRetries: payment.maxRetries,
    };
  }

  // ── 3. PROCESS SUCCESS ─────────────────────────
  private static async processSuccess(payment: any, gatewayPayment: any, meta: PaymentMeta) {
    const transactionId = gatewayPayment.cf_payment_id?.toString() || `cf_${Date.now()}`;

    // Update payment record atomically
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCESS',
        gatewayStatus: 'SUCCESS',
        signatureVerified: true,
        transactionId,
        paymentMethod: gatewayPayment.payment_method ? (typeof gatewayPayment.payment_method === 'object' ? Object.keys(gatewayPayment.payment_method)[0] : String(gatewayPayment.payment_method)) : null,
      }
    });

    // Update order to PROCESSING
    const updatedOrder = await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'PROCESSING' },
      include: { user: true }
    });

    // Log events
    await this.logEvent(payment.id, 'PAYMENT_SUCCESS', `Payment of ₹${payment.amount} received via ${gatewayPayment.payment_method || 'online'}`, meta);
    await this.logEvent(payment.id, 'ORDER_CONFIRMED', `Order ${payment.orderId} confirmed`, meta);

    // Create order timeline entry
    await prisma.orderTimeline.create({
      data: {
        orderId: payment.orderId,
        status: 'PROCESSING',
        note: `Payment of ₹${payment.amount} received. Transaction ID: ${transactionId}`,
        type: 'STATUS_CHANGE',
      }
    });

    // Send notifications
    const customerEmail = updatedOrder.user?.email || 'support@anukicrochet.in';
    sendOrderConfirmationEmail(customerEmail, updatedOrder.id, updatedOrder.totalAmount).catch(console.error);

    if (updatedOrder.userId) {
      NotificationService.send({
        userId: updatedOrder.userId,
        role: 'customer',
        title: 'Payment Successful! 🎉',
        message: `Your payment of ₹${payment.amount} was successful. Order #${updatedOrder.id.slice(-8).toUpperCase()} is confirmed.`,
        category: 'payments',
        priority: 'high',
        actionUrl: `/order-status/${updatedOrder.id}`
      }).catch(console.error);
    }

    NotificationService.sendAdminAlert({
      title: 'Payment Received',
      message: `Payment of ₹${payment.amount} received for Order #${updatedOrder.id.slice(-8).toUpperCase()} via ${gatewayPayment.payment_method || 'Cashfree'}.`,
      category: 'payments',
      priority: 'high',
      actionUrl: `/admin/orders/${updatedOrder.id}`
    }).catch(console.error);

    return {
      success: true,
      status: 'SUCCESS',
      message: 'Payment verified successfully!',
      transactionId,
      orderId: payment.orderId,
      amount: payment.amount,
      paymentMethod: gatewayPayment.payment_method,
    };
  }

  // ── 4. COD PAYMENT ─────────────────────────────
  static async createCodPayment(orderId: string, amount: number, meta: PaymentMeta = {}) {
    const payment = await prisma.payment.create({
      data: {
        orderId,
        transactionId: `cod_${orderId}_${Date.now()}`,
        gateway: 'COD',
        amount,
        currency: 'INR',
        paymentMethod: 'cod',
        status: 'COD_PENDING',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        sessionId: meta.sessionId,
      }
    });

    await this.logEvent(payment.id, 'COD_ORDER_PLACED', `COD order placed for ₹${amount}`, meta);

    return payment;
  }

  // ── 5. RETRY PAYMENT ───────────────────────────
  static async retryPayment(
    orderId: string,
    user: { id: string; email?: string; phone?: string; name?: string },
    meta: PaymentMeta = {}
  ) {
    const payment = await prisma.payment.findUnique({ where: { orderId } });

    if (!payment) {
      throw new Error('No payment found for this order');
    }

    if ((TERMINAL_SUCCESS as readonly string[]).includes(payment.status)) {
      throw new Error('Payment already completed. Cannot retry.');
    }

    if (payment.status === 'PROCESSING' || payment.status === 'PENDING') {
      throw new Error('Payment is still being processed. Please wait.');
    }

    if (!(RETRYABLE_STATUSES as readonly string[]).includes(payment.status)) {
      throw new Error(`Cannot retry payment with status: ${payment.status}`);
    }

    if (payment.retryCount >= payment.maxRetries) {
      throw new Error('Maximum retry attempts reached. Please contact support.');
    }

    // Re-use initiatePayment which handles retry logic
    return this.initiatePayment(orderId, payment.amount, user, meta);
  }

  // ── 6. GET PAYMENT STATUS ──────────────────────
  static async getPaymentStatus(orderId: string) {
    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: {
        events: { orderBy: { createdAt: 'asc' } },
        order: {
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: { include: { images: { take: 1, orderBy: { order: 'asc' } } } }
                  }
                }
              }
            },
            user: { select: { id: true, email: true, fullName: true } }
          }
        }
      }
    });

    if (!payment) {
      return null;
    }

    return {
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        gateway: payment.gateway,
        transactionId: payment.transactionId,
        paymentMethod: payment.paymentMethod,
        retryCount: payment.retryCount,
        maxRetries: payment.maxRetries,
        failureReason: payment.failureReason,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
      order: payment.order,
      timeline: payment.events.map(e => ({
        id: e.id,
        event: e.eventName,
        description: e.description,
        timestamp: e.createdAt,
      })),
      retryAllowed: (RETRYABLE_STATUSES as readonly string[]).includes(payment.status) && payment.retryCount < payment.maxRetries,
    };
  }

  // ── 7. ADMIN: GET PAYMENT LOGS ─────────────────
  static async getPaymentLogs(paymentId: string) {
    return prisma.paymentLog.findMany({
      where: { paymentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── 8. ADMIN: PAYMENT ANALYTICS ────────────────
  static async getPaymentAnalytics(dateRange?: { from: Date; to: Date }) {
    const where: any = {};
    if (dateRange) {
      where.createdAt = { gte: dateRange.from, lte: dateRange.to };
    }

    const [
      total,
      success,
      failed,
      pending,
      dropped,
      cancelled,
      codPending,
      codConfirmed,
      refunded,
      totalRevenue,
      totalRefunded,
    ] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.count({ where: { ...where, status: 'SUCCESS' } }),
      prisma.payment.count({ where: { ...where, status: 'FAILED' } }),
      prisma.payment.count({ where: { ...where, status: 'PENDING' } }),
      prisma.payment.count({ where: { ...where, status: 'USER_DROPPED' } }),
      prisma.payment.count({ where: { ...where, status: 'CANCELLED' } }),
      prisma.payment.count({ where: { ...where, status: 'COD_PENDING' } }),
      prisma.payment.count({ where: { ...where, status: 'COD_CONFIRMED' } }),
      prisma.payment.count({ where: { ...where, status: { in: ['REFUNDED', 'PARTIALLY_REFUNDED'] } } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { ...where, status: 'SUCCESS' } }),
      prisma.payment.aggregate({ _sum: { refundAmount: true }, where: { ...where, status: { in: ['REFUNDED', 'PARTIALLY_REFUNDED'] } } }),
    ]);

    const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : '0';
    const failureRate = total > 0 ? ((failed / total) * 100).toFixed(1) : '0';
    const dropRate = total > 0 ? ((dropped / total) * 100).toFixed(1) : '0';
    const codPercentage = total > 0 ? (((codPending + codConfirmed) / total) * 100).toFixed(1) : '0';

    return {
      total,
      success,
      failed,
      pending,
      dropped,
      cancelled,
      codPending,
      codConfirmed,
      refunded,
      successRate,
      failureRate,
      dropRate,
      codPercentage,
      revenue: totalRevenue._sum.amount || 0,
      refundedAmount: totalRefunded._sum.refundAmount || 0,
    };
  }

  // ── 9. CLEANUP EXPIRED ─────────────────────────
  static async cleanupExpiredPayments() {
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);

    const expiredPayments = await prisma.payment.findMany({
      where: {
        status: { in: ['INITIATED', 'PROCESSING'] },
        createdAt: { lt: thirtyMinAgo },
      },
      include: {
        order: {
          include: {
            items: { include: { variant: true } }
          }
        }
      }
    });

    let cleaned = 0;

    for (const payment of expiredPayments) {
      try {
        await prisma.$transaction(async (tx) => {
          // Mark payment as EXPIRED
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: 'EXPIRED', failureReason: 'Payment session expired' }
          });

          // Only cancel order if it's still AWAITING_PAYMENT
          if (payment.order.status === 'AWAITING_PAYMENT') {
            // Restore inventory
            for (const item of payment.order.items) {
              await tx.variant.update({
                where: { id: item.variantId },
                data: { stock: { increment: item.quantity } }
              });
            }

            await tx.order.update({
              where: { id: payment.orderId },
              data: { status: 'CANCELLED' }
            });
          }

          await tx.paymentEvent.create({
            data: {
              paymentId: payment.id,
              eventName: 'PAYMENT_EXPIRED',
              description: 'Payment session expired after 30 minutes',
            }
          });
        });

        cleaned++;
      } catch (err) {
        console.error(`Failed to cleanup payment ${payment.id}:`, err);
      }
    }

    return { cleaned, total: expiredPayments.length };
  }

  // ── HELPERS ────────────────────────────────────

  private static async createCashfreeOrder(
    orderId: string,
    amount: number,
    user: { id: string; email?: string; phone?: string; name?: string }
  ) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')
        || (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}` : null)
        || (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null)
        || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
        || 'https://www.anukicrochet.in';

      const request = {
        order_amount: amount,
        order_currency: 'INR',
        order_id: `ord_${orderId.replace(/-/g, '').slice(0, 12)}_${Date.now()}`,
        customer_details: {
          customer_id: user.id || 'guest',
          customer_phone: user.phone || '9999999999',
          customer_name: user.name || 'Guest User',
          customer_email: user.email || 'support@anukicrochet.in',
        },
        order_meta: {
          return_url: `${baseUrl}/order-status/${orderId}?cf_order_id={order_id}`
        }
      };

    const response = await cashfreeClient.PGCreateOrder(request as any);
    return {
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
    };
  }

  private static async logEvent(paymentId: string, eventName: string, description: string, meta?: PaymentMeta) {
    try {
      await prisma.paymentEvent.create({
        data: { paymentId, eventName, description, metadata: meta ? (meta as any) : undefined }
      });
    } catch (err) {
      console.error('Failed to log payment event:', err);
    }
  }

  private static async logPayment(paymentId: string, event: string, status: string, request?: any, response?: any, meta?: PaymentMeta) {
    try {
      await prisma.paymentLog.create({
        data: {
          paymentId,
          event,
          status,
          requestPayload: request || undefined,
          responsePayload: response || undefined,
          ipAddress: meta?.ipAddress,
          device: meta?.device,
          browser: meta?.browser,
          os: meta?.os,
          sessionId: meta?.sessionId,
        }
      });
    } catch (err) {
      console.error('Failed to log payment:', err);
    }
  }

  private static async sendFailureNotifications(payment: any, status: string, reason: string | null) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: payment.orderId },
        include: { user: true }
      });

      if (!order?.userId) return;

      const messages: Record<string, { title: string; message: string }> = {
        FAILED: {
          title: 'Payment Failed',
          message: reason || 'Your payment could not be processed. Please try again.'
        },
        USER_DROPPED: {
          title: 'Payment Incomplete',
          message: 'Your payment was interrupted. Tap to complete your purchase.'
        },
        CANCELLED: {
          title: 'Payment Cancelled',
          message: 'You cancelled the payment. Your cart items are saved.'
        },
      };

      const msg = messages[status] || messages.FAILED;

      await NotificationService.send({
        userId: order.userId,
        role: 'customer',
        title: msg.title,
        message: msg.message,
        category: 'payments',
        priority: 'medium',
        actionUrl: `/order-status/${order.id}`
      });

      await NotificationService.sendAdminAlert({
        title: `Payment ${status}`,
        message: `Payment ${status.toLowerCase()} for Order #${order.id.slice(-8).toUpperCase()}. ${reason || ''}`,
        category: 'payments',
        priority: status === 'FAILED' ? 'high' : 'medium',
        actionUrl: `/admin/orders/${order.id}`
      });
    } catch (err) {
      console.error('Failed to send failure notifications:', err);
    }
  }
}
