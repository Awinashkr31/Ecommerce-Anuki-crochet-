import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';

const router = Router();
import { prisma } from '../lib/prisma';

// GET /api/audit-logs (Super Admin Only)
router.get('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN']), async (req: any, res: any) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, email: true, role: true } }
      },
      take: 100 // Limit for performance
    });

    return res.json(logs);
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

export default router;
