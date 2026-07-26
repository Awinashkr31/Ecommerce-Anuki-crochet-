import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';

const router = Router();
import { prisma } from '../lib/prisma';

// GET all categories
router.get('/', async (req: any, res: any) => {
  try {
    const categories = await prisma.category.findMany({
      include: { children: true },
    });
    return res.json(categories);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch categories' });
  }
});

// POST new category (Admin only)
router.post('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const body = req.body;
    const { name, slug, description, parentId } = body;
    const category = await prisma.category.create({
      data: { name, slug, description, parentId },
    });
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
    const { name, slug, description, parentId } = body;
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, description, parentId },
    });
    return res.json(category);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to update category' });
  }
});

// DELETE category (Admin only)
router.delete('/:id', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
