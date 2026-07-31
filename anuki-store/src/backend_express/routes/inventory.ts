import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';

const router = Router();
import { prisma } from '../lib/prisma';

// GET inventory logs for a variant
router.get('/:variantId/logs', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const { variantId } = req.params;
    const logs = await prisma.inventoryLog.findMany({
      where: { variantId },
      include: { user: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(logs);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch inventory logs' });
  }
});

// POST adjust inventory
router.post('/adjust', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const body = req.body;
    const { variantId, changeAmount, reason } = body;
    
    if (changeAmount === 0) return res.status(400).json({ error: 'Change amount cannot be 0' });
    if (!['RESTOCK', 'MANUAL', 'ORDER', 'RETURN'].includes(reason)) {
      return res.status(400).json({ error: 'Invalid reason code' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const variant = await tx.variant.update({
        where: { id: variantId },
        data: {
          stock: { increment: changeAmount }
        }
      });

      const log = await tx.inventoryLog.create({
        data: {
          variantId,
          changeAmount,
          reason,
          userId: req.user.userId
        }
      });

      return { variant, log };
    });

    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to adjust inventory' });
  }
});

export default router;
