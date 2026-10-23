/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { verifyToken, requireRoles } from '../middleware/auth';
import { GIFT_PAGES } from '../../lib/gift-pages';
import { SEO_PAGES } from '../../lib/seo-pages';

const router = Router();

// Helper to count words
function countWords(str?: string | null): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

// Inbound link references known in code graph
const FOOTER_AND_NAV_SLUGS = new Set([
  'gifts/birthday', 'gifts/anniversary', 'gifts/valentines-day', 'gifts/under-499', 'gifts/under-999',
  'categories/flower-bouquets', 'categories/flower-pots', 'categories/toys', 'categories/keychains', 'categories/hair-accessories',
  'custom', 'custom-crochet-india', 'custom-crochet-gifts', 'crochet-flower-bouquets', 'amigurumi-gifts', 'crochet-plushies',
  'custom-crochet-bouquet', 'crochet-flowers', 'amigurumi'
]);

// GET all pages SEO with publishing checklist metrics
router.get('/pages', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN', 'CATALOG_MANAGER', 'MARKETING']), async (req: any, res: any) => {
  try {
    const { type, search } = req.query;
    const where: any = {};
    if (type && type !== 'all') {
      where.pageType = String(type).toUpperCase();
    }
    if (search) {
      where.OR = [
        { slug: { contains: String(search), mode: 'insensitive' } },
        { seoTitle: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const pages = await prisma.pageSeo.findMany({
      where,
      orderBy: [{ pageType: 'asc' }, { slug: 'asc' }],
    });

    // Check duplicate descriptions among pages
    const descCountMap = new Map<string, number>();
    for (const p of pages) {
      if (p.metaDescription) {
        const key = p.metaDescription.trim().toLowerCase();
        descCountMap.set(key, (descCountMap.get(key) || 0) + 1);
      }
    }

    const enriched = pages.map((p) => {
      const words = countWords(p.introContent);
      const descKey = p.metaDescription ? p.metaDescription.trim().toLowerCase() : '';
      const isUniqueDesc = Boolean(descKey && (descCountMap.get(descKey) || 0) <= 1);
      const cleanSlug = p.slug.startsWith('gifts/') ? p.slug : p.slug;
      const hasInboundLink = FOOTER_AND_NAV_SLUGS.has(cleanSlug) || FOOTER_AND_NAV_SLUGS.has(p.slug.replace('gifts/', ''));

      const meetsWords = words >= 120;
      const meetsDesc = isUniqueDesc && Boolean(p.metaDescription && p.metaDescription.length >= 50);
      const meetsLinks = hasInboundLink;
      const isPublishable = meetsWords && meetsDesc && meetsLinks;

      return {
        ...p,
        metrics: {
          wordCount: words,
          meetsWords,
          hasUniqueMetaDesc: meetsDesc,
          inboundLinksCount: hasInboundLink ? 1 : 0,
          meetsLinks,
          isPublishable,
        },
      };
    });

    res.json(enriched);
  } catch (error) {
    console.error('Error fetching SEO pages:', error);
    res.status(500).json({ error: 'Failed to fetch SEO pages' });
  }
});

// POST check duplicates for title and meta description
router.post('/check-duplicates', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const { seoTitle, metaDescription, currentSlug } = req.body;
    const cleanTitle = (seoTitle || '').trim().toLowerCase();
    const cleanDesc = (metaDescription || '').trim().toLowerCase();

    const titleMatches: string[] = [];
    const descMatches: string[] = [];

    if (cleanTitle) {
      const [prods, cats, posts, seoPages] = await Promise.all([
        prisma.product.findMany({ where: { seoTitle: { equals: cleanTitle, mode: 'insensitive' } }, select: { slug: true } }),
        prisma.category.findMany({ where: { seoTitle: { equals: cleanTitle, mode: 'insensitive' } }, select: { slug: true } }),
        prisma.post.findMany({ where: { seoTitle: { equals: cleanTitle, mode: 'insensitive' } }, select: { slug: true } }),
        prisma.pageSeo.findMany({ where: { seoTitle: { equals: cleanTitle, mode: 'insensitive' } }, select: { slug: true } }),
      ]);
      prods.forEach(p => p.slug !== currentSlug && titleMatches.push(`Product: /products/${p.slug}`));
      cats.forEach(c => c.slug !== currentSlug && titleMatches.push(`Category: /categories/${c.slug}`));
      posts.forEach(p => p.slug !== currentSlug && titleMatches.push(`Blog: /blog/${p.slug}`));
      seoPages.forEach(p => p.slug !== currentSlug && titleMatches.push(`Page: /${p.slug}`));
    }

    if (cleanDesc) {
      const [prods, cats, posts, seoPages] = await Promise.all([
        prisma.product.findMany({ where: { seoDesc: { equals: cleanDesc, mode: 'insensitive' } }, select: { slug: true } }),
        prisma.category.findMany({ where: { seoDesc: { equals: cleanDesc, mode: 'insensitive' } }, select: { slug: true } }),
        prisma.post.findMany({ where: { seoDesc: { equals: cleanDesc, mode: 'insensitive' } }, select: { slug: true } }),
        prisma.pageSeo.findMany({ where: { metaDescription: { equals: cleanDesc, mode: 'insensitive' } }, select: { slug: true } }),
      ]);
      prods.forEach(p => p.slug !== currentSlug && descMatches.push(`Product: /products/${p.slug}`));
      cats.forEach(c => c.slug !== currentSlug && descMatches.push(`Category: /categories/${c.slug}`));
      posts.forEach(p => p.slug !== currentSlug && descMatches.push(`Blog: /blog/${p.slug}`));
      seoPages.forEach(p => p.slug !== currentSlug && descMatches.push(`Page: /${p.slug}`));
    }

    res.json({
      isDuplicateTitle: titleMatches.length > 0,
      titleMatches,
      isDuplicateDesc: descMatches.length > 0,
      descMatches,
    });
  } catch (error) {
    console.error('Error checking duplicates:', error);
    res.status(500).json({ error: 'Failed to check duplicates' });
  }
});

// PUT update page SEO
router.put('/pages/:id', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN', 'CATALOG_MANAGER', 'MARKETING']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    let { slug, seoTitle, metaDescription, canonicalUrl, noIndex, introContent } = req.body;

    // Enforce lowercase-hyphen slug
    if (slug) {
      slug = slug
        .toLowerCase()
        .trim()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9/]+/g, '-')
        .replace(/\/+/g, '/')
        .replace(/^-+|-+$/g, '');
    }

    // Publishing Guard: if noIndex is being set to false (i.e. to index the page)
    if (noIndex === false) {
      const words = countWords(introContent);
      const hasDesc = Boolean(metaDescription && metaDescription.trim().length >= 40);
      const cleanSlug = slug || '';
      const hasInbound = FOOTER_AND_NAV_SLUGS.has(cleanSlug) || FOOTER_AND_NAV_SLUGS.has(cleanSlug.replace('gifts/', ''));

      const reasons: string[] = [];
      if (words < 120) reasons.push(`Intro content has ${words} words (minimum 120 required)`);
      if (!hasDesc) reasons.push(`Meta description is missing or too short (minimum 40 characters required)`);
      if (!hasInbound) reasons.push(`No inbound internal link found in navigation/footer crawl graph`);

      if (reasons.length > 0) {
        return res.status(400).json({
          error: `Publishing guard blocked indexing: ${reasons.join('; ')}`,
          checklistErrors: reasons,
        });
      }
    }

    const updated = await prisma.pageSeo.update({
      where: { id },
      data: {
        ...(slug ? { slug } : {}),
        ...(seoTitle !== undefined ? { seoTitle: seoTitle ? seoTitle.trim() : null } : {}),
        ...(metaDescription !== undefined ? { metaDescription: metaDescription ? metaDescription.trim() : null } : {}),
        ...(canonicalUrl !== undefined ? { canonicalUrl: canonicalUrl ? canonicalUrl.trim() : null } : {}),
        ...(noIndex !== undefined ? { noIndex: Boolean(noIndex) } : {}),
        ...(introContent !== undefined ? { introContent } : {}),
      },
    });

    res.json(updated);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A page with this slug already exists' });
    }
    console.error('Error updating page SEO:', error);
    res.status(500).json({ error: 'Failed to update page SEO' });
  }
});

// PUT toggle index/no-index directly
router.put('/pages/:id/toggle-index', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const page = await prisma.pageSeo.findUnique({ where: { id } });
    if (!page) return res.status(404).json({ error: 'Page not found' });

    const newNoIndex = !page.noIndex;

    // If switching to Indexed (noIndex = false), verify publishing guard
    if (newNoIndex === false) {
      const words = countWords(page.introContent);
      const hasDesc = Boolean(page.metaDescription && page.metaDescription.trim().length >= 40);
      const cleanSlug = page.slug || '';
      const hasInbound = FOOTER_AND_NAV_SLUGS.has(cleanSlug) || FOOTER_AND_NAV_SLUGS.has(cleanSlug.replace('gifts/', ''));

      const reasons: string[] = [];
      if (words < 120) reasons.push(`Intro content has ${words} words (min 120 required)`);
      if (!hasDesc) reasons.push(`Meta description is missing or too short`);
      if (!hasInbound) reasons.push(`No inbound internal link found in navigation/footer crawl graph`);

      if (reasons.length > 0) {
        return res.status(400).json({
          error: `Publishing guard blocked indexing: ${reasons.join('; ')}`,
          checklistErrors: reasons,
        });
      }
    }

    const updated = await prisma.pageSeo.update({
      where: { id },
      data: { noIndex: newNoIndex },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error toggling index status:', error);
    res.status(500).json({ error: 'Failed to toggle index status' });
  }
});

// GET checklist audit report for the existing un-indexed pages
router.get('/audit-report', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const pages = await prisma.pageSeo.findMany({
      orderBy: [{ pageType: 'asc' }, { slug: 'asc' }],
    });

    const report = pages.map((p) => {
      const words = countWords(p.introContent);
      const hasDesc = Boolean(p.metaDescription && p.metaDescription.trim().length >= 40);
      const cleanSlug = p.slug.startsWith('gifts/') ? p.slug : p.slug;
      const hasInbound = FOOTER_AND_NAV_SLUGS.has(cleanSlug) || FOOTER_AND_NAV_SLUGS.has(p.slug.replace('gifts/', ''));

      const failsWords = words < 120;
      const failsDesc = !hasDesc;
      const failsLinks = !hasInbound;

      const failedCriteria: string[] = [];
      if (failsWords) failedCriteria.push(`<120 words (${words} words)`);
      if (failsDesc) failedCriteria.push('Missing/insufficient meta description');
      if (failsLinks) failedCriteria.push('Missing inbound internal link');

      return {
        slug: p.slug,
        pageType: p.pageType,
        currentIndexStatus: p.noIndex ? 'NOINDEX' : 'INDEXED',
        wordCount: words,
        hasMetaDesc: hasDesc,
        hasInboundLink: hasInbound,
        passesAll: failedCriteria.length === 0,
        failedCriteria,
      };
    });

    const failingPages = report.filter((r) => !r.passesAll);
    const passingPages = report.filter((r) => r.passesAll);

    res.json({
      totalEvaluated: report.length,
      passingCount: passingPages.length,
      failingCount: failingPages.length,
      failingPages,
      passingPages,
    });
  } catch (error) {
    console.error('Error generating audit report:', error);
    res.status(500).json({ error: 'Failed to generate audit report' });
  }
});

export default router;
