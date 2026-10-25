import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';

const router = Router();
import { prisma } from '../lib/prisma';

// GET all published posts (Public)
router.get('/', async (req: any, res: any) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
        author: { select: { fullName: true } }
      } // Exclude heavy content for list view
    });
    return res.json(posts);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch posts' });
  }
});

// GET single post by slug (Public)
router.get('/:slug', async (req: any, res: any) => {
  try {
    const { slug } = req.params;
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { author: { select: { fullName: true } } }
    });
    
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (!post.published) return res.status(403).json({ error: 'Post is not published' });
    
    return res.json(post);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch post' });
  }
});

// Admin Routes Below
// ------------------

// GET all posts including unpublished (Admin)
router.get('/admin/all', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { fullName: true } } }
    });
    return res.json(posts);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to fetch posts' });
  }
});

// POST Create new post (Admin)
router.post('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const body = req.body;
    const { title, slug, content, published, authorId, seoTitle, seoDesc, canonicalUrl, noIndex } = body;
    const cleanSlug = slug
      ? String(slug).toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      : String(title).toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    
    const post = await prisma.post.create({
      data: { 
        title, 
        slug: cleanSlug, 
        content, 
        published: Boolean(published), 
        authorId,
        seoTitle: seoTitle ? String(seoTitle).trim() : null,
        seoDesc: seoDesc ? String(seoDesc).trim() : null,
        canonicalUrl: canonicalUrl ? String(canonicalUrl).trim() : null,
        noIndex: Boolean(noIndex),
      }
    });
    
    return res.status(201).json(post);
  } catch (error: any) {
    return res.status(400).json({ error: 'Failed to save post.' });
  }
});

// PUT Update post (Admin)
router.put('/:id', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, slug, content, published, authorId, seoTitle, seoDesc, canonicalUrl, noIndex } = req.body;
    const cleanSlug = slug
      ? String(slug).toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      : undefined;
    
    const post = await prisma.post.update({
      where: { id },
      data: { 
        title, 
        ...(cleanSlug ? { slug: cleanSlug } : {}), 
        content, 
        published: published !== undefined ? Boolean(published) : undefined, 
        authorId,
        ...(seoTitle !== undefined ? { seoTitle: seoTitle ? String(seoTitle).trim() : null } : {}),
        ...(seoDesc !== undefined ? { seoDesc: seoDesc ? String(seoDesc).trim() : null } : {}),
        ...(canonicalUrl !== undefined ? { canonicalUrl: canonicalUrl ? String(canonicalUrl).trim() : null } : {}),
        ...(noIndex !== undefined ? { noIndex: Boolean(noIndex) } : {}),
      }
    });
    
    return res.json(post);
  } catch (error: any) {
    return res.status(400).json({ error: 'Failed to update post.' });
  }
});

// DELETE post (Admin)
router.delete('/:id', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'MARKETING']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(400).json({ error: 'Failed to delete post.' });
  }
});

export default router;
