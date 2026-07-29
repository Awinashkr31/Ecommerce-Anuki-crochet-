import { prisma } from '../lib/prisma';

export interface NotificationPayload {
  userId: string;
  role?: string;
  title: string;
  message: string;
  category: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  channel?: string; // e.g. 'in-app', 'email', 'sms', 'push', 'all'
  actionUrl?: string;
  image?: string;
  icon?: string;
}

export class NotificationService {
  /**
   * Send a notification. Checks user preferences before logging an external delivery (email/sms).
   */
  static async send(payload: NotificationPayload) {
    try {
      const {
        userId,
        role = 'customer',
        title,
        message,
        category,
        priority = 'low',
        channel = 'in-app',
        actionUrl,
        image,
        icon
      } = payload;

      // 1. Check user preferences if role is customer
      if (role === 'customer') {
        const prefs = await prisma.notificationPreference.findUnique({
          where: { userId }
        });

        if (prefs) {
          if (category === 'orders' && !prefs.orderEnabled) return;
          if (category === 'marketing' && !prefs.marketingEnabled) return;
          if (category === 'security' && !prefs.securityEnabled) return;
          if (category === 'reviews' && !prefs.reviewEnabled) return;
          
          // Determine if we should also send email/sms
          // In a real app we'd dispatch to queue here based on `prefs.emailEnabled`, `prefs.smsEnabled`
        } else {
          // If no prefs exist, maybe create default prefs or just proceed with default true
        }
      }

      // 2. Create In-App Notification
      const notification = await prisma.notification.create({
        data: {
          userId,
          role,
          title,
          message,
          category,
          priority,
          channel,
          actionUrl,
          image,
          icon
        }
      });

      // 3. Log delivery status (MOCK: assume delivered to IN_APP)
      await prisma.notificationLog.create({
        data: {
          notificationId: notification.id,
          deliveryChannel: 'IN_APP',
          status: 'DELIVERED',
          deliveredAt: new Date()
        }
      });

      // (Optional) Here you would add jobs to a queue for Email / SMS if channel is 'all' or specific

      return notification;
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

  /**
   * Broadcast an alert to all Admin users
   */
  static async sendAdminAlert(payload: Omit<NotificationPayload, 'userId' | 'role'>) {
    try {
      const admins = await prisma.user.findMany({
        where: { role: { in: ['ADMIN', 'SUPER_ADMIN', 'ORDER_FULFILLMENT'] } }
      });

      const notifications = admins.map(admin => ({
        userId: admin.id,
        role: 'admin',
        title: payload.title,
        message: payload.message,
        category: payload.category,
        priority: payload.priority || 'medium',
        channel: payload.channel || 'in-app',
        actionUrl: payload.actionUrl,
        image: payload.image,
        icon: payload.icon
      }));

      for (const n of notifications) {
        await this.send(n);
      }
    } catch (error) {
      console.error('Failed to send admin alert:', error);
    }
  }
}
