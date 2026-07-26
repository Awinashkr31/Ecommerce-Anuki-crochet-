import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';

const router = Router();
import { prisma } from '../lib/prisma';

// GET all store settings
router.get('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN']), async (req: any, res: any) => {
  try {
    const settings = await prisma.storeSettings.findMany();
    // Convert array of key-value objects to a single object map
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    
    return res.json(settingsMap);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch store settings' });
  }
});

// PUT update store settings (bulk)
router.put('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN']), async (req: any, res: any) => {
  try {
    const updates = req.body; // Expects a map of key-value pairs
    
    await prisma.$transaction(
      Object.entries(updates).map(([key, value]) =>
        prisma.storeSettings.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) }
        })
      )
    );

    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: 'Failed to update store settings' });
  }
});

export default router;
