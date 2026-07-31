import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/wallet
router.get('/', verifyToken, async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId, balance: 0 },
        include: { transactions: true }
      });
    }

    return res.json(wallet);
  } catch (error: any) {
    console.error('Fetch wallet error:', error);
    return res.status(500).json({ error: 'Failed to fetch wallet' });
  }
});

export default router;
