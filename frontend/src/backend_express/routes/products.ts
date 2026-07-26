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
      basePrice, salePrice, status, variants, images, customizationOptions,
      featured, trending, bestseller, limitedEdition,
      weight, length, width, height, lowStockThreshold, maxOrdersPerDay,
      costPrice, taxSettings, sku, barcode, stockStatus,
      subcategoryId, brand, tags, collections, isHandmade, material,
      careInstructions, countryOfOrigin, shippingCharges, freeShipping,
      seoTitle, seoDesc, seoKeywords, canonicalUrl, ogImage, videoUrl
    } = body;

    const product = await prisma.product.create({
      data: {
        name, slug, shortDesc, fullDesc, categoryId, isMadeToOrder, processingDays,
        basePrice, salePrice, status,
        featured, trending, bestseller, limitedEdition,
        weight, length, width, height, lowStockThreshold, maxOrdersPerDay,
        costPrice, taxSettings, sku, barcode, stockStatus,
        subcategoryId, brand, tags, collections, isHandmade, material,
        careInstructions, countryOfOrigin, shippingCharges, freeShipping,
        seoTitle, seoDesc, seoKeywords, canonicalUrl, ogImage, videoUrl,
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
      basePrice, salePrice, status,
      featured, trending, bestseller, limitedEdition,
      weight, length, width, height, lowStockThreshold, maxOrdersPerDay,
      costPrice, taxSettings, sku, barcode, stockStatus,
      subcategoryId, brand, tags, collections, isHandmade, material,
      careInstructions, countryOfOrigin, shippingCharges, freeShipping,
      seoTitle, seoDesc, seoKeywords, canonicalUrl, ogImage, videoUrl,
      variants, images
    } = body;

    // First update the scalar fields
    const product = await prisma.product.update({
      where: { id: id as string },
      data: {
        name, slug, shortDesc, fullDesc, categoryId, isMadeToOrder, processingDays,
        basePrice, salePrice, status,
        featured, trending, bestseller, limitedEdition,
        weight, length, width, height, lowStockThreshold, maxOrdersPerDay,
        costPrice, taxSettings, sku, barcode, stockStatus,
        subcategoryId, brand, tags, collections, isHandmade, material,
        careInstructions, countryOfOrigin, shippingCharges, freeShipping,
        seoTitle, seoDesc, seoKeywords, canonicalUrl, ogImage, videoUrl
      },
    });

    // Handle variant replacements if provided
    if (variants) {
      await prisma.variant.deleteMany({ where: { productId: id as string } });
      for (const v of variants) {
        await prisma.variant.create({ data: { ...v, productId: id as string } });
      }
    }

    // Handle image replacements if provided
    if (images) {
      await prisma.image.deleteMany({ where: { productId: id as string } });
      for (const img of images) {
        await prisma.image.create({ data: { ...img, productId: id as string } });
      }
    }

    await invalidateProductsCache();
    await createAuditLog(req.user.userId, 'UPDATE_PRODUCT', product.id, { name: product.name });

    return res.json(product);
  } catch (error) {
    console.error("Update Product Error:", error);
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

// POST copy product (Admin only)
router.post('/:id/copy', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const original = await prisma.product.findUnique({ where: { id } });
    if (!original) return res.status(404).json({ error: 'Product not found' });

    // Ensure unique slug
    const newName = `${original.name} (Copy)`;
    let newSlug = `${original.slug}-copy`;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug: newSlug } })) {
      newSlug = `${original.slug}-copy-${counter}`;
      counter++;
    }

    const copiedProduct = await prisma.product.create({
      data: {
        name: newName,
        slug: newSlug,
        shortDesc: original.shortDesc,
        fullDesc: original.fullDesc,
        categoryId: original.categoryId,
        isMadeToOrder: original.isMadeToOrder,
        processingDays: original.processingDays,
        basePrice: original.basePrice,
        salePrice: original.salePrice,
        status: 'DRAFT',
        featured: false,
        trending: false,
        bestseller: false,
        limitedEdition: false,
        weight: original.weight,
        length: original.length,
        width: original.width,
        height: original.height,
        lowStockThreshold: original.lowStockThreshold,
        maxOrdersPerDay: original.maxOrdersPerDay,
        costPrice: original.costPrice,
        taxSettings: original.taxSettings,
        sku: null,
        barcode: null,
        stockStatus: 'OUT_OF_STOCK',
        subcategoryId: original.subcategoryId,
        brand: original.brand,
        tags: original.tags,
        collections: original.collections,
        isHandmade: original.isHandmade,
        material: original.material,
        careInstructions: original.careInstructions,
        countryOfOrigin: original.countryOfOrigin,
        shippingCharges: original.shippingCharges,
        freeShipping: original.freeShipping,
        seoTitle: original.seoTitle,
        seoDesc: original.seoDesc,
        seoKeywords: original.seoKeywords,
        canonicalUrl: original.canonicalUrl,
        videoUrl: original.videoUrl,
      }
    });

    await invalidateProductsCache();
    await createAuditLog(req.user.userId, 'COPY_PRODUCT', copiedProduct.id, { originalId: id });

    return res.status(201).json(copiedProduct);
  } catch (error) {
    console.error("Copy Product Error:", error);
    return res.status(500).json({ error: 'Failed to copy product' });
  }
});

// Variant CRUD endpoints
router.post('/:id/variants', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const variantData = req.body;
    const variant = await prisma.variant.create({
      data: { ...variantData, productId: id }
    });
    await invalidateProductsCache();
    return res.status(201).json(variant);
  } catch (error) {
    console.error("Create Variant Error:", error);
    return res.status(500).json({ error: 'Failed to create variant' });
  }
});

router.put('/:id/variants/:variantId', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const { variantId } = req.params;
    const variantData = req.body;
    const variant = await prisma.variant.update({
      where: { id: variantId },
      data: variantData
    });
    await invalidateProductsCache();
    return res.json(variant);
  } catch (error) {
    console.error("Update Variant Error:", error);
    return res.status(500).json({ error: 'Failed to update variant' });
  }
});

router.delete('/:id/variants/:variantId', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const { variantId } = req.params;
    await prisma.variant.delete({ where: { id: variantId } });
    await invalidateProductsCache();
    return res.status(204).send();
  } catch (error) {
    console.error("Delete Variant Error:", error);
    return res.status(500).json({ error: 'Failed to delete variant' });
  }
});

router.post('/:id/variants/:variantId/copy', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    const { variantId, id } = req.params;
    const original = await prisma.variant.findUnique({ where: { id: variantId } });
    if (!original) return res.status(404).json({ error: 'Variant not found' });

    // Generate unique SKU for copy
    const newSku = `${original.sku || 'VAR'}-copy-${Date.now()}`;
    // Copy variant logic
    const copiedVariant = await prisma.variant.create({
      data: {
        productId: id,
        sku: newSku,
        color: original.color ? `${original.color} (Copy)` : null,
        size: original.size,
        material: original.material,
        style: original.style,
        attributes: original.attributes || undefined,
        imageUrl: null, // Reset image
        price: original.price,
        stock: 0, // Reset stock
      }
    });

    await invalidateProductsCache();
    return res.status(201).json(copiedVariant);
  } catch (error) {
    console.error("Copy Variant Error:", error);
    return res.status(500).json({ error: 'Failed to copy variant' });
  }
});

export default router;
