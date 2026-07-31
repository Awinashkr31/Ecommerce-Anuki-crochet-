import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
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

dotenv.config();

const app = express();
app.set('trust proxy', 1);
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
app.use(express.json({ limit: '2mb' })); // Reduced from 10mb — uploads use multipart, not JSON
app.use(cookieParser());

// ── Rate Limiters ──────────────────────────────────
// Global: 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown',
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', strictLimiter, orderRoutes);      // Strict: order creation
app.use('/api/returns', returnRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', strictLimiter, uploadRoutes);      // Strict: file uploads
app.use('/api/payments', strictLimiter, paymentRoutes);   // Strict: payment creation
app.use('/api/shipping', shippingRoutes);
app.use('/api/audit-logs', auditLogsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/banners', bannerRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Log full error server-side for debugging
  console.error('Express Global Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });
  // Never send internal error details to clients
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({ error: 'Something went wrong. Please try again later.' });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
