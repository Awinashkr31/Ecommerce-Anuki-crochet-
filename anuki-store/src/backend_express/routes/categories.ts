/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';

const router = Router();
import { prisma } from '../lib/prisma';
import redisClient from '../lib/redis';

const CACHE_KEY = 'categories_all';

// GET all categories
router.get('/', async (req: any, res: any) => {
  try {
    if (redisClient.isReady) {
      const cached = await redisClient.get(CACHE_KEY);
      if (cached) return res.json(JSON.parse(cached));
    }

    const categories = await prisma.category.findMany({
      include: { 
        children: true,
        products: {
          take: 1,
          where: { status: 'PUBLISHED' },
          select: {
            images: {
              take: 1,
              orderBy: { order: 'asc' },
              select: { url: true }
            }
          }
        }
      },
    });

    if (redisClient.isReady) {
      await redisClient.setEx(CACHE_KEY, 3600, JSON.stringify(categories)); // 1 hour cache
    }

    return res.json(categories);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch categories' });
  }
});

// POST new category (Admin only)
router.post('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const body = req.body;
    const { name, slug, description, parentId, bannerUrl } = body;
    const category = await prisma.category.create({
      data: { name, slug, description, parentId, bannerUrl },
    });
    if (redisClient.isReady) await redisClient.del(CACHE_KEY);
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT update category (Admin only)
router.put('/:id', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const { name, slug, description, parentId, bannerUrl } = body;
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, description, parentId, bannerUrl },
    });
    if (redisClient.isReady) await redisClient.del(CACHE_KEY);
    return res.json(category);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to update category' });
  }
});

// DELETE category (Admin only)
router.delete('/:id', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id },
    });
    if (redisClient.isReady) await redisClient.del(CACHE_KEY);
    return res.json({ message: 'Category deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
