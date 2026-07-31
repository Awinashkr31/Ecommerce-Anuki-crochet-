import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = Router();

// GET all banners (Public)
router.get('/', async (req: any, res: any) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' }
    });
    return res.json(banners);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch banners' });
  }
});

// Admin Routes Below
// ------------------

// POST Create new banner (Admin)
router.post('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const { title, imageUrl, link, status, startDate, endDate, order } = req.body;
    
    const banner = await prisma.banner.create({
      data: { 
        title, 
        imageUrl, 
        link, 
        status, 
        startDate: startDate ? new Date(startDate) : null, 
        endDate: endDate ? new Date(endDate) : null, 
        order: order ? parseInt(order) : 0 
      }
    });
    
    return res.status(201).json(banner);
  } catch (error: any) {
    return res.status(400).json({ error: 'Failed to save banner.' });
  }
});

// PUT Update banner (Admin)
router.put('/:id', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, imageUrl, link, status, startDate, endDate, order } = req.body;
    
    const banner = await prisma.banner.update({
      where: { id },
      data: { 
        title, 
        imageUrl, 
        link, 
        status, 
        startDate: startDate ? new Date(startDate) : null, 
        endDate: endDate ? new Date(endDate) : null, 
        order: order !== undefined ? parseInt(order) : undefined
      }
    });
    
    return res.json(banner);
  } catch (error: any) {
    return res.status(400).json({ error: 'Failed to update banner.' });
  }
});

// DELETE banner (Admin)
router.delete('/:id', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await prisma.banner.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(400).json({ error: 'Failed to delete banner.' });
  }
});

export default router;
