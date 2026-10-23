import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';

const router = Router();
import { prisma } from '../lib/prisma';

// GET all inventory items (Variants + Base Products without variants)
router.get('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER', 'ORDER_FULFILLMENT']), async (req: any, res: any) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: true,
      },
      orderBy: { name: 'asc' }
    });

    const items: any[] = [];

    for (const product of products) {
      if (product.variants && product.variants.length > 0) {
        for (const variant of product.variants) {
          items.push({
            id: variant.id,
            sku: variant.sku || `${product.id.slice(0, 8)}-v`,
            color: variant.color || product.color || null,
            size: variant.size || product.size || null,
            price: variant.salePrice || variant.price || product.salePrice || product.basePrice,
            stock: variant.stock,
            lowStockThreshold: variant.lowStockThreshold || product.lowStockThreshold || 5,
            product: {
              id: product.id,
              name: product.name,
              isMadeToOrder: product.isMadeToOrder
            }
          });
        }
      } else {
        // Base product inventory item
        items.push({
          id: `prod_${product.id}`,
          sku: product.sku || `PRD-${product.id.slice(0, 8).toUpperCase()}`,
          color: product.color || null,
          size: product.size || null,
          price: product.salePrice || product.basePrice,
          stock: product.stock,
          lowStockThreshold: product.lowStockThreshold || 5,
          product: {
            id: product.id,
            name: product.name,
            isMadeToOrder: product.isMadeToOrder
          }
        });
      }
    }

    return res.json(items);
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    return res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// PUT adjust stock for a variant or base product
router.put('/:id', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { change, reason = 'MANUAL' } = req.body;
    const changeAmount = Number(change);

    if (isNaN(changeAmount) || changeAmount === 0) {
      return res.status(400).json({ error: 'Valid non-zero change amount required' });
    }

    if (id.startsWith('prod_')) {
      const productId = id.replace('prod_', '');
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) return res.status(404).json({ error: 'Product not found' });

      const newStock = Math.max(0, product.stock + changeAmount);
      const updated = await prisma.product.update({
        where: { id: productId },
        data: { stock: newStock }
      });
      return res.json({ success: true, item: updated });
    } else {
      const variant = await prisma.variant.findUnique({ where: { id } });
      if (!variant) return res.status(404).json({ error: 'Variant not found' });

      const newStock = Math.max(0, variant.stock + changeAmount);
      const updated = await prisma.variant.update({
        where: { id },
        data: { stock: newStock }
      });

      // Also log if user is present
      if (req.user?.userId) {
        await prisma.inventoryLog.create({
          data: {
            variantId: id,
            changeAmount,
            reason: ['RESTOCK', 'MANUAL', 'ORDER', 'RETURN'].includes(reason) ? reason : 'MANUAL',
            userId: req.user.userId
          }
        }).catch(console.error);
      }

      return res.json({ success: true, item: updated });
    }
  } catch (error) {
    console.error('Failed to adjust stock:', error);
    return res.status(400).json({ error: 'Failed to adjust stock' });
  }
});

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

// POST adjust inventory (legacy endpoint)
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
