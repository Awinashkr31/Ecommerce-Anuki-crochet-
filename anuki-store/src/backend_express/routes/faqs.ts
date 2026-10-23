/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { verifyToken, requireRoles } from '../middleware/auth';

const router = Router();

// GET all FAQs (Public or Admin)
router.get('/', async (req: any, res: any) => {
  try {
    const { section, all } = req.query;
    const where: any = {};
    if (section) where.section = String(section);
    if (all !== 'true') where.isActive = true;

    const faqs = await prisma.faq.findMany({
      where,
      orderBy: [{ section: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }],
    });
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching faqs:', error);
    res.status(500).json({ error: 'Failed to fetch faqs' });
  }
});

// POST new FAQ (Admin)
router.post('/', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN']), async (req: any, res: any) => {
  try {
    const { section = 'home', question, answer, order = 0, isActive = true } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    const faq = await prisma.faq.create({
      data: {
        section,
        question: question.trim(),
        answer: answer.trim(),
        order: Number(order) || 0,
        isActive: Boolean(isActive),
      },
    });

    res.status(201).json(faq);
  } catch (error) {
    console.error('Error creating faq:', error);
    res.status(500).json({ error: 'Failed to create faq' });
  }
});

// PUT update FAQ (Admin)
router.put('/:id', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { section, question, answer, order, isActive } = req.body;

    const faq = await prisma.faq.update({
      where: { id },
      data: {
        ...(section ? { section } : {}),
        ...(question ? { question: question.trim() } : {}),
        ...(answer ? { answer: answer.trim() } : {}),
        ...(order !== undefined ? { order: Number(order) } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
    });

    res.json(faq);
  } catch (error) {
    console.error('Error updating faq:', error);
    res.status(500).json({ error: 'Failed to update faq' });
  }
});

// DELETE FAQ (Admin)
router.delete('/:id', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await prisma.faq.delete({ where: { id } });
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting faq:', error);
    res.status(500).json({ error: 'Failed to delete faq' });
  }
});

export default router;
