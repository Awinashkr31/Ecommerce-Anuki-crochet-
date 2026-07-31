import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = Router();

// ------------------------------
// Web Push Routes
// ------------------------------

// Get VAPID public key
router.get('/vapid-key', (req: any, res: any) => {
  res.json({ publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY });
});

// Subscribe to push notifications
router.post('/subscribe', verifyToken, async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const subscription = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription object' });
    }

    const { endpoint, keys } = subscription;

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        userId,
        p256dh: keys?.p256dh || '',
        auth: keys?.auth || ''
      },
      create: {
        userId,
        endpoint,
        p256dh: keys?.p256dh || '',
        auth: keys?.auth || ''
      }
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

// ------------------------------
// Customer Routes
// ------------------------------

// Get my notifications
router.get('/my', verifyToken, async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, unreadOnly = 'false' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { userId, isArchived: false };
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false, isArchived: false }
    });

    return res.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark one as read
router.put('/:id/read', verifyToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Ensure the notification belongs to the user or user is admin
    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif) return res.status(404).json({ error: 'Not found' });
    if (notif.userId !== req.user.userId && !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
    
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark all as read
router.put('/mark-all-read', verifyToken, async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

// Get user preferences
router.get('/preferences', verifyToken, async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    let prefs = await prisma.notificationPreference.findUnique({ where: { userId } });
    
    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: { userId }
      });
    }
    
    return res.json(prefs);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// Update user preferences
router.put('/preferences', verifyToken, async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const body = req.body;
    
    const prefs = await prisma.notificationPreference.upsert({
      where: { userId },
      update: body,
      create: { userId, ...body }
    });
    
    return res.json(prefs);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// ------------------------------
// Admin Routes
// ------------------------------

// Get admin analytics
router.get('/analytics', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN']), async (req: any, res: any) => {
  try {
    const totalSent = await prisma.notification.count();
    const readCount = await prisma.notification.count({ where: { isRead: true } });
    const failedCount = await prisma.notificationLog.count({ where: { status: 'FAILED' } });
    const emailLogs = await prisma.notificationLog.count({ where: { deliveryChannel: 'EMAIL' } });
    const smsLogs = await prisma.notificationLog.count({ where: { deliveryChannel: 'SMS' } });
    
    return res.json({
      totalSent,
      readRate: totalSent > 0 ? ((readCount / totalSent) * 100).toFixed(1) : 0,
      failedCount,
      channelUsage: {
        inApp: totalSent, // assuming all go to in-app
        email: emailLogs,
        sms: smsLogs
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
