/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';

const router = Router();
import { prisma } from '../lib/prisma';
import redisClient from '../lib/redis';

const CACHE_KEY = 'settings_public';

// GET public store settings (no auth required)
router.get('/public', async (req: any, res: any) => {
  try {
    if (redisClient.isReady) {
      const cached = await redisClient.get(CACHE_KEY);
      if (cached) return res.json(JSON.parse(cached));
    }

    const keys = [
      'min_order_value', 'free_delivery_threshold', 'delivery_charge', 'cod_extra_charge', 'cod_payment_status',
      'instagram_handle', 'instagram_reel_1', 'instagram_reel_2', 'instagram_reel_3', 'instagram_reel_4'
    ];
    const settings = await prisma.storeSettings.findMany({
      where: { key: { in: keys } }
    });
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    
    if (redisClient.isReady) {
      await redisClient.setEx(CACHE_KEY, 3600, JSON.stringify(settingsMap));
    }

    return res.json(settingsMap);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch public settings' });
  }
});

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

    if (redisClient.isReady) await redisClient.del(CACHE_KEY);
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: 'Failed to update store settings' });
  }
});

export default router;
