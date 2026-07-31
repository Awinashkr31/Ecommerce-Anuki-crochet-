import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';
import { NotificationService } from '../services/notifications';

const router = Router();
import { prisma } from '../lib/prisma';

// POST Request a return (Customer)
router.post('/', verifyToken, async (req: any, res: any) => {
  try {
    const body = req.body;
    const { orderItemId, reason, images, refundMethod } = body;
    
    // Check if order item exists
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { order: true }
    });
    
    if (!orderItem) return res.status(404).json({ error: 'Order item not found' });
    
    // Create return request
    const returnReq = await prisma.returnRequest.create({
      data: {
        orderItemId,
        reason,
        images: images || [],
        refundMethod
      }
    });

    await NotificationService.sendEmail(
      'admin@crochet.local', 
      'New Return Request', 
      `A return was requested for Order Item ${orderItemId}. Reason: ${reason}`
    );

    return res.status(201).json(returnReq);
  } catch (error: any) {
    return res.status(400).json({ error: 'Failed to process return request.' });
  }
});

// GET all return requests (Admin)
router.get('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CUSTOMER_SUPPORT']), async (req: any, res: any) => {
  try {
    const returns = await prisma.returnRequest.findMany({
      include: {
        orderItem: {
          include: {
            variant: { include: { product: true } },
            order: { include: { user: { select: { email: true, fullName: true } } } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(returns);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch returns' });
  }
});

// PUT Approve/Reject return (Admin)
router.put('/:id', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CUSTOMER_SUPPORT']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const { status, adminComments } = body; // 'APPROVED', 'REJECTED', 'REFUNDED'
    
    const returnReq = await prisma.returnRequest.findUnique({
      where: { id },
      include: { orderItem: { include: { order: { include: { user: true } } } } }
    });
    
    if (!returnReq) return res.status(404).json({ error: 'Return request not found' });
    
    // Perform transaction if refunding to wallet
    const updatedReturn = await prisma.$transaction(async (tx) => {
      const updated = await tx.returnRequest.update({
        where: { id },
        data: { status, adminComments }
      });

      // If approved for wallet refund, credit wallet
      if (status === 'REFUNDED' && returnReq.refundMethod === 'WALLET' && returnReq.orderItem.order.userId) {
        const userId = returnReq.orderItem.order.userId;
        
        let wallet = await tx.wallet.findUnique({ where: { userId } });
        if (!wallet) {
          wallet = await tx.wallet.create({ data: { userId, balance: 0 } });
        }
        
        const refundAmount = returnReq.orderItem.price * returnReq.orderItem.quantity;
        
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: refundAmount } }
        });

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            amount: refundAmount,
            type: 'CREDIT',
            description: `Refund for returned item ${returnReq.orderItemId}`
          }
        });

        const userEmail = returnReq.orderItem.order.user?.email;
        if (userEmail) {
          await NotificationService.sendEmail(
            userEmail,
            'Refund Processed',
            `Your return has been approved and ₹${refundAmount} has been credited to your store wallet.`
          );
        }
      }

      return updated;
    });

    return res.json(updatedReturn);
  } catch (error: any) {
    return res.status(400).json({ error: 'Failed to process return request.' });
  }
});

export default router;
