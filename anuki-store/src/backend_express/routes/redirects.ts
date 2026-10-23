/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { verifyToken, requireRoles } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

const router = Router();

async function syncRedirectsJson() {
  try {
    const activeRedirects = await prisma.redirect.findMany({
      where: { isActive: true },
      select: { fromPath: true, toPath: true, statusCode: true },
    });
    const filePath = path.join(process.cwd(), 'src', 'lib', 'redirects-data.json');
    fs.writeFileSync(filePath, JSON.stringify(activeRedirects, null, 2));
  } catch (err) {
    console.error('Failed to sync redirects-data.json:', err);
  }
}

// GET all redirects (Admin)
router.get('/', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN']), async (req: any, res: any) => {
  try {
    const redirects = await prisma.redirect.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(redirects);
  } catch (error) {
    console.error('Error fetching redirects:', error);
    res.status(500).json({ error: 'Failed to fetch redirects' });
  }
});

// POST new redirect (Admin)
router.post('/', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN']), async (req: any, res: any) => {
  try {
    let { fromPath, toPath, statusCode = 301, isActive = true } = req.body;
    if (!fromPath || !toPath) {
      return res.status(400).json({ error: 'fromPath and toPath are required' });
    }

    if (!fromPath.startsWith('/')) fromPath = `/${fromPath}`;
    if (!toPath.startsWith('/') && !toPath.startsWith('http')) toPath = `/${toPath}`;

    const redirect = await prisma.redirect.create({
      data: {
        fromPath,
        toPath,
        statusCode: Number(statusCode) || 301,
        isActive: Boolean(isActive),
      },
    });

    await syncRedirectsJson();
    res.status(201).json(redirect);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A redirect for this from_path already exists' });
    }
    console.error('Error creating redirect:', error);
    res.status(500).json({ error: 'Failed to create redirect' });
  }
});

// PUT update redirect / toggle active
router.put('/:id', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    let { fromPath, toPath, statusCode, isActive } = req.body;

    if (fromPath && !fromPath.startsWith('/')) fromPath = `/${fromPath}`;
    if (toPath && !toPath.startsWith('/') && !toPath.startsWith('http')) toPath = `/${toPath}`;

    const redirect = await prisma.redirect.update({
      where: { id },
      data: {
        ...(fromPath ? { fromPath } : {}),
        ...(toPath ? { toPath } : {}),
        ...(statusCode !== undefined ? { statusCode: Number(statusCode) } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
    });

    await syncRedirectsJson();
    res.json(redirect);
  } catch (error) {
    console.error('Error updating redirect:', error);
    res.status(500).json({ error: 'Failed to update redirect' });
  }
});

// DELETE redirect
router.delete('/:id', verifyToken, requireRoles(['SUPER_ADMIN', 'ADMIN']), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await prisma.redirect.delete({ where: { id } });
    await syncRedirectsJson();
    res.json({ message: 'Redirect deleted successfully' });
  } catch (error) {
    console.error('Error deleting redirect:', error);
    res.status(500).json({ error: 'Failed to delete redirect' });
  }
});

export default router;
