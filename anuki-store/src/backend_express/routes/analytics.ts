import { Router } from 'express';
import { verifyToken, requireRoles } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { startOfDay, startOfWeek, startOfMonth } from 'date-fns';
import redisClient from '../lib/redis';

const router = Router();
const ADMIN_ANALYTICS_CACHE_KEY = 'admin_dashboard_analytics';

router.get('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'FINANCE', 'MARKETING', 'ORDER_FULFILLMENT', 'CUSTOMER_SUPPORT', 'CATALOG_MANAGER']), async (req: any, res: any) => {
  try {
    // 1. Check Redis Cache
    if (redisClient.isReady) {
      const cachedData = await redisClient.get(ADMIN_ANALYTICS_CACHE_KEY);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }
    }

    // Time boundaries
    const now = new Date();
    const todayStart = startOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
    const monthStart = startOfMonth(now);

    const orders = await prisma.order.findMany({
      where: { 
        status: { not: 'CANCELLED' },
        createdAt: { gte: monthStart }
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        totalAmount: true,
        items: {
          select: {
            quantity: true,
            price: true,
            variant: {
              select: {
                product: {
                  select: { name: true, category: { select: { name: true } } }
                }
              }
            }
          }
        },
        user: {
          select: { id: true }
        }
      }
    });

    const lowStockVariants = await prisma.variant.count({
      where: { stock: { lt: 5 } }
    });

    // Time boundaries already defined above

    const filterOrders = (start: Date) => orders.filter(o => new Date(o.createdAt) >= start);
    const todayOrders = filterOrders(todayStart);
    const weekOrders = filterOrders(weekStart);
    const monthOrders = filterOrders(monthStart);

    const aggregateData = (orderList: any[]) => {
      const revenue = orderList.reduce((acc, o) => acc + o.totalAmount, 0);
      const pendingAction = orderList.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length;
      
      const productSales: Record<string, { name: string, units: number, revenue: number }> = {};
      const categorySales: Record<string, number> = {};

      orderList.forEach(order => {
        order.items.forEach((item: any) => {
          const product = item.variant?.product;
          const categoryName = product?.category?.name || 'Uncategorized';
          const productName = product?.name || 'Unknown';
          
          if (!productSales[productName]) {
            productSales[productName] = { name: productName, units: 0, revenue: 0 };
          }
          productSales[productName].units += item.quantity;
          productSales[productName].revenue += item.price * item.quantity;

          if (!categorySales[categoryName]) categorySales[categoryName] = 0;
          categorySales[categoryName] += item.quantity;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      const categories = Object.keys(categorySales).map(key => ({
        name: key,
        value: categorySales[key]
      }));

      // Simplified salesTrend to avoid complex date manipulation for now
      // It returns flat data; can be expanded later
      const salesTrend = [{ label: 'Total', revenue }];

      return {
        revenue,
        ordersPlaced: orderList.length,
        pendingAction,
        lowStock: lowStockVariants,
        newSignups: 0,
        salesTrend,
        topProducts,
        categories
      };
    };

    const analytics = {
      today: aggregateData(todayOrders),
      week: aggregateData(weekOrders),
      month: aggregateData(monthOrders),
    };

    return res.json(analytics);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
