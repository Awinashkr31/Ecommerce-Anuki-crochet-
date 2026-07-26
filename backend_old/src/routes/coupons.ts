import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';

const router = Router();
import { prisma } from '../lib/prisma';

// POST Validate a coupon (Customer checkout)
router.post('/validate', async (req: any, res: any) => {
  try {
    const body = req.body;
    const { code, orderValue } = body;
    
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    if (!coupon.isActive) return res.status(400).json({ error: 'Coupon is inactive' });
    if (coupon.validTo && new Date() > new Date(coupon.validTo)) return res.status(400).json({ error: 'Coupon has expired' });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ error: 'Coupon usage limit reached' });
    if (orderValue < coupon.minOrderValue) return res.status(400).json({ error: `Minimum order value is ₹${coupon.minOrderValue}` });
    
    // Calculate discount
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = (orderValue * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }
    
    return res.json({ valid: true, discount, coupon: { id: coupon.id, code: coupon.code } });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin Routes Below
// ------------------

// GET all coupons
router.get('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json(coupons);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch coupons' });
  }
});

// POST Create coupon
router.post('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const data = req.body;
    const coupon = await prisma.coupon.create({ data });
    return res.status(201).json(coupon);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// PUT Toggle active status
router.put('/:id/toggle', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    
    const updated = await prisma.coupon.update({
      where: { id },
      data: { isActive: !coupon.isActive }
    });
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to update coupon' });
  }
});

export default router;
