import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';
import redisClient from '../lib/redis';

const router = Router();
import { prisma } from '../lib/prisma';

const PRODUCTS_CACHE_KEY = 'products_all';

// GET all products
router.get('/', async (req: any, res: any) => {
  try {
    // 1. Try Cache
    if (redisClient.isReady) {
      const cached = await redisClient.get(PRODUCTS_CACHE_KEY);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }

    // 2. Fetch from DB
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        variants: true,
      },
    });

    // 3. Set Cache (expire in 15 mins)
    if (redisClient.isReady) {
      await redisClient.setEx(PRODUCTS_CACHE_KEY, 900, JSON.stringify(products));
    }

    return res.json(products);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch products' });
  }
});

// GET single product by slug
router.get('/slug/:slug', async (req: any, res: any) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug: slug as string },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        variants: true,
        customizationOptions: true,
      },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.json(product);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch product' });
  }
});

// GET single product by id
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: id as string },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        variants: true,
        customizationOptions: true,
      },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.json(product);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch product' });
  }
});

const invalidateProductsCache = async () => {
  if (redisClient.isReady) {
    await redisClient.del(PRODUCTS_CACHE_KEY);
  }
};

const createAuditLog = async (userId: string, action: string, entityId: string, details: any) => {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entityId,
      details: JSON.stringify(details)
    }
  });
};

// POST new product (Admin only)
router.post('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const body = req.body;
    const {
      name, slug, shortDesc, fullDesc, categoryId, isMadeToOrder, processingDays,
      basePrice, salePrice, published, variants, images, customizationOptions,
      featured, trending, bestseller, limitedEdition,
      weight, length, width, height, lowStockThreshold, maxOrdersPerDay
    } = body;

    const product = await prisma.product.create({
      data: {
        name, slug, shortDesc, fullDesc, categoryId, isMadeToOrder, processingDays,
        basePrice, salePrice, published,
        featured, trending, bestseller, limitedEdition,
        weight, length, width, height, lowStockThreshold, maxOrdersPerDay,
        variants: {
          create: variants || []
        },
        images: {
          create: images || []
        },
        customizationOptions: {
          create: customizationOptions || []
        }
      },
      include: { variants: true, images: true, customizationOptions: true }
    });

    await invalidateProductsCache();
    await createAuditLog(req.user.userId, 'CREATE_PRODUCT', product.id, { name: product.name });

    return res.status(201).json(product);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product (Admin only)
router.put('/:id', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const {
      name, slug, shortDesc, fullDesc, categoryId, isMadeToOrder, processingDays,
      basePrice, salePrice, published,
      featured, trending, bestseller, limitedEdition,
      weight, length, width, height, lowStockThreshold, maxOrdersPerDay
    } = body;

    const product = await prisma.product.update({
      where: { id: id as string },
      data: {
        name, slug, shortDesc, fullDesc, categoryId, isMadeToOrder, processingDays,
        basePrice, salePrice, published,
        featured, trending, bestseller, limitedEdition,
        weight, length, width, height, lowStockThreshold, maxOrdersPerDay
      },
    });

    await invalidateProductsCache();
    await createAuditLog(req.user.userId, 'UPDATE_PRODUCT', product.id, { name: product.name });

    return res.json(product);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to update product' });
  }
});

// DELETE product (Admin only)
router.delete('/:id', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await prisma.variant.deleteMany({ where: { productId: id as string } });
    await prisma.image.deleteMany({ where: { productId: id as string } });
    await prisma.customizationOption.deleteMany({ where: { productId: id as string } });
    await prisma.review.deleteMany({ where: { productId: id as string } });
    await prisma.product.delete({ where: { id: id as string } });
    
    await invalidateProductsCache();
    await createAuditLog(req.user.userId, 'DELETE_PRODUCT', id as string, {});

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
