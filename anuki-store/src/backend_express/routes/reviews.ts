import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { verifyToken, requireRoles, AuthRequest } from '../middleware/auth';

const router = Router();

// GET all reviews for Admin Dashboard
router.get('/admin', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN']), async (req: AuthRequest, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { fullName: true, email: true } },
        product: { select: { name: true, slug: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET approved reviews for a product (Public)
router.get('/product/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { productId, approved: true },
      include: {
        user: { select: { fullName: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST submit a review
router.post('/', verifyToken, async (req: AuthRequest, res) => {
  const { productId, rating, comment, imageUrls } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!productId || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid rating or product ID' });
  }

  // Ensure imageUrls is an array and max 2 elements
  const finalImageUrls = Array.isArray(imageUrls) ? imageUrls.slice(0, 2) : [];

  try {
    // Check if user has already reviewed this product
    const existing = await prisma.review.findFirst({
      where: { userId, productId }
    });

    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this product.' });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
        imageUrls: finalImageUrls,
        approved: false // Requires admin approval
      },
      include: {
        user: { select: { fullName: true, avatarUrl: true } }
      }
    });

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT approve/reject a review
router.put('/:id/status', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN']), async (req: AuthRequest, res) => {
  const id = req.params.id as string;
  const { action } = req.body; // 'APPROVE' or 'REJECT'

  if (!['APPROVE', 'REJECT'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  try {
    const review = await prisma.review.update({
      where: { id },
      data: { approved: action === 'APPROVE' }
    });
    res.json(review);
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a review
router.delete('/:id', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN']), async (req: AuthRequest, res) => {
  const id = req.params.id as string;
  try {
    await prisma.review.delete({ where: { id } });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
