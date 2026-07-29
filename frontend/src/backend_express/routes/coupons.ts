import { Router } from 'express';
import { verifyToken, requireRoles, optionalAuth } from '../middleware/auth';

const router = Router();
import { prisma } from '../lib/prisma';

// POST Validate a coupon (Customer checkout)
router.post('/validate', optionalAuth, async (req: any, res: any) => {
  try {
    const { code, orderValue, items = [] } = req.body;
    const userId = req.user?.userId || req.body.userId || null;
    
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    if (coupon.status !== 'ACTIVE' && !coupon.isActive) return res.status(400).json({ error: 'Coupon is inactive' });
    if (coupon.validTo && new Date() > new Date(coupon.validTo)) return res.status(400).json({ error: 'Coupon has expired' });
    if (coupon.validFrom && new Date() < new Date(coupon.validFrom)) return res.status(400).json({ error: 'Coupon is not yet valid' });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ error: 'Coupon usage limit reached' });
    if (orderValue < coupon.minOrderValue) return res.status(400).json({ error: `Minimum order value is ₹${coupon.minOrderValue}` });
    
    // Check quantity constraints
    const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    if (coupon.minQuantity && totalItems < coupon.minQuantity) return res.status(400).json({ error: `Minimum ${coupon.minQuantity} items required` });
    
    // Check user limits
    if (userId) {
      if (coupon.maxUsesPerUser) {
        const userUsage = await prisma.couponUsage.count({ where: { couponId: coupon.id, userId } });
        if (userUsage >= coupon.maxUsesPerUser) return res.status(400).json({ error: 'You have reached the maximum usage limit for this coupon' });
      }
      if (coupon.firstOrderOnly) {
        const orderCount = await prisma.order.count({ where: { userId } });
        if (orderCount > 0) return res.status(400).json({ error: 'This coupon is only valid for your first order' });
      }
    } else if (coupon.firstOrderOnly || coupon.maxUsesPerUser) {
        return res.status(401).json({ error: 'You must be logged in to use this coupon' });
    }

    // Target specific products or exclude them
    let eligibleItems = items;
    if (coupon.applicableProductIds && coupon.applicableProductIds.length > 0) {
      eligibleItems = eligibleItems.filter((item: any) => coupon.applicableProductIds.includes(item.productId));
      if (eligibleItems.length === 0) return res.status(400).json({ error: 'Coupon does not apply to any items in your cart' });
    }
    if (coupon.excludeProductIds && coupon.excludeProductIds.length > 0) {
      eligibleItems = eligibleItems.filter((item: any) => !coupon.excludeProductIds.includes(item.productId));
      if (eligibleItems.length === 0) return res.status(400).json({ error: 'Coupon cannot be used with the items in your cart' });
    }

    // BOGO logic
    if (coupon.type === 'BOGO') {
      if (!coupon.buyQuantity || !coupon.getQuantity) return res.status(400).json({ error: 'Invalid BOGO configuration' });
      
      const bogoItemCount = eligibleItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
      if (bogoItemCount < (coupon.buyQuantity + coupon.getQuantity)) {
         return res.status(400).json({ error: `Add at least ${coupon.buyQuantity + coupon.getQuantity} qualifying items to get the offer` });
      }
      
      let bogoTimes = Math.floor(bogoItemCount / (coupon.buyQuantity + coupon.getQuantity));
      let itemsToDiscount = bogoTimes * coupon.getQuantity;
      
      const sortedItems = [...eligibleItems].sort((a: any, b: any) => a.price - b.price);
      let discount = 0;
      for (const item of sortedItems) {
        const qtyToDiscount = Math.min(itemsToDiscount, item.quantity);
        discount += qtyToDiscount * item.price;
        itemsToDiscount -= qtyToDiscount;
        if (itemsToDiscount <= 0) break;
      }
      
      if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
      return res.json({ valid: true, discount, coupon: { id: coupon.id, code: coupon.code, type: coupon.type } });
    }

    // Calculate discount for PERCENTAGE, FLAT, FREE_SHIPPING
    const eligibleTotal = eligibleItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = (eligibleTotal * coupon.value) / 100;
    } else if (coupon.type === 'FLAT') {
      discount = coupon.value;
      if (discount > eligibleTotal) discount = eligibleTotal;
    } else if (coupon.type === 'FREE_SHIPPING') {
      return res.json({ valid: true, discount: 0, freeShipping: true, coupon: { id: coupon.id, code: coupon.code, type: coupon.type } });
    }
    
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
    
    return res.json({ valid: true, discount, coupon: { id: coupon.id, code: coupon.code, type: coupon.type } });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});


// Admin Routes Below
// ------------------

// GET all coupons
router.get('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' }, include: { _count: { select: { usages: true } } } });
    return res.json(coupons);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch coupons' });
  }
});

// GET Coupon Analytics
router.get('/analytics', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    // Basic stats
    const totalCoupons = await prisma.coupon.count();
    const activeCoupons = await prisma.coupon.count({ where: { status: 'ACTIVE' } });
    const expiredCoupons = await prisma.coupon.count({ where: { status: 'EXPIRED' } });
    
    // Revenue and usage
    const usages = await prisma.couponUsage.findMany();
    
    const totalDiscountGiven = usages.reduce((sum: number, u: any) => sum + u.discountAmount, 0);
    const revenueGenerated = usages.reduce((sum: number, u: any) => sum + u.orderTotal, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const usageToday = usages.filter((u: any) => new Date(u.createdAt) >= today).length;
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const usageThisMonth = usages.filter((u: any) => new Date(u.createdAt) >= startOfMonth).length;
    
    const avgOrderValue = usages.length > 0 ? revenueGenerated / usages.length : 0;
    
    // In a real app we'd calculate conversion rate by dividing usages by total orders.
    // For now we mock it or calculate it simply.
    const totalOrdersCount = await prisma.order.count();
    const conversionRate = totalOrdersCount > 0 ? ((usages.length / totalOrdersCount) * 100).toFixed(2) : 0;

    return res.json({
      totalCoupons,
      activeCoupons,
      expiredCoupons,
      totalDiscountGiven,
      revenueGenerated,
      usageToday,
      usageThisMonth,
      avgOrderValue,
      conversionRate
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch analytics' });
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

// GET single coupon
router.get('/:id', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    return res.json(coupon);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch coupon' });
  }
});

// PUT update coupon
router.put('/:id', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const coupon = await prisma.coupon.update({
      where: { id },
      data
    });
    return res.json(coupon);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to update coupon' });
  }
});

// DELETE coupon
router.delete('/:id', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: 'Failed to delete coupon' });
  }
});

export default router;
