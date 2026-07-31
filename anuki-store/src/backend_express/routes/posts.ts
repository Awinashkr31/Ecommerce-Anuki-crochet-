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
    const { title, slug, content, published, authorId } = body;
    
    const post = await prisma.post.create({
      data: { title, slug, content, published, authorId }
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
    const { title, slug, content, published, authorId } = req.body;
    
    const post = await prisma.post.update({
      where: { id },
      data: { title, slug, content, published, authorId }
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
