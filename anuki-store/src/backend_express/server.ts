/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import orderRoutes from './routes/orders';
import returnRoutes from './routes/returns';
import couponRoutes from './routes/coupons';
import postRoutes from './routes/posts';
import analyticsRoutes from './routes/analytics';
import uploadRoutes from './routes/upload';
import paymentRoutes from './routes/payments';
import shippingRoutes from './routes/shipping';
import auditLogsRoutes from './routes/auditLogs';
import inventoryRoutes from './routes/inventory';
import settingsRoutes from './routes/settings';
import addressRoutes from './routes/addresses';
import notificationRoutes from './routes/notifications';
import walletRoutes from './routes/wallet';
import bannerRoutes from './routes/banners';
import reviewRoutes from './routes/reviews';
import os from 'os';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
app.set('etag', 'strong'); // Enable strong ETags
const PORT = process.env.PORT || 5000;

// Security headers — hide Express fingerprint and set strict policies
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.cashfree.com', 'https://sandbox.cashfree.com'],
    },
  },
  crossOriginEmbedderPolicy: false, // needed for external images
}));
app.disable('x-powered-by');

// Phase 16: Slow API Detection Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 800) {
      console.warn(`[SLOW API ALERT] ${req.method} ${req.originalUrl} took ${duration}ms`);
    }
  });
  next();
});

const allowedOrigins = [
  'http://localhost:3000',
  'http://anukicrochet.in',
  'https://anukicrochet.in',
  'http://www.anukicrochet.in',
  'https://www.anukicrochet.in',
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(compression()); // Enable Gzip/Brotli compression
app.use(express.json({ limit: '2mb' })); // Reduced from 10mb — uploads use multipart, not JSON
app.use(cookieParser());

// ── Rate Limiters ──────────────────────────────────
// Global: 2000 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict: 20 requests per 15 minutes (payments, uploads, orders)
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Rate limit exceeded for this action. Please wait.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply global limiter to all API routes
app.use('/api', globalLimiter);

// ── Caching Middleware ─────────────────────────────
const apiCache = (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => {
  // 5 minutes edge cache, 10 minutes stale-while-revalidate
  res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  next();
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', apiCache, productRoutes);
app.use('/api/categories', apiCache, categoryRoutes);
app.use('/api/orders', strictLimiter, orderRoutes);      // Strict: order creation
app.use('/api/returns', returnRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/posts', apiCache, postRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', strictLimiter, uploadRoutes);      // Strict: file uploads
app.use('/api/payments', strictLimiter, paymentRoutes);   // Strict: payment creation
app.use('/api/shipping', shippingRoutes);
app.use('/api/audit-logs', auditLogsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/settings', apiCache, settingsRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/health', (req, res) => {
  const memUsage = process.memoryUsage();
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    metrics: {
      uptimeSeconds: process.uptime(),
      memory: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      },
      cpuLoad: os.loadavg()
    }
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Log full error server-side for debugging
  console.error('Express Global Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });
  
  // Return the error message to the client temporarily for debugging the 500 error
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({ 
    error: 'Something went wrong.',
    details: err.message,
    stack: err.stack
  });
});

// When running as a Next.js API route, we do not want Express to start its own server.
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL && process.env.START_STANDALONE_EXPRESS === 'true') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
