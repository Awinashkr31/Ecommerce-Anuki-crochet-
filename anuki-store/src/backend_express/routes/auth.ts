import { Router } from 'express';
import { z } from 'zod';
import { rateLimit } from 'express-rate-limit';
import { prisma } from '../lib/prisma';
import { authAdmin } from '../lib/firebaseAdmin';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // increased for general auth endpoints
  message: { error: 'Too many requests, try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

const sessionSchema = z.object({
  idToken: z.string(),
  // optionally we can receive user details if we want to ensure Prisma is updated immediately
  // but verifyIdToken returns name, picture, email
});

// POST /api/auth/session
// Exchanges a Firebase ID Token for a Firebase Session Cookie and syncs user to Postgres
router.post('/session', authLimiter, async (req: any, res: any) => {
  try {
    const { idToken } = sessionSchema.parse(req.body);
    
    // Verify the ID token first
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email!;
    const name = decodedToken.name || email.split('@')[0];
    const picture = decodedToken.picture || null;
    const authProvider = decodedToken.firebase.sign_in_provider === 'password' ? 'EMAIL' : 'GOOGLE';

    // Sync user with PostgreSQL via Prisma
    let user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) {
      // Check if user exists by email (in case they signed up before Firebase integration)
      user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        // Update existing user with Firebase UID and provider
        user = await prisma.user.update({
          where: { email },
          data: {
            id: uid,
            fullName: name,
            avatarUrl: picture,
            authProvider,
          },
        });
      } else {
        // Create brand new user
        user = await prisma.user.create({
          data: {
            id: uid, // Use Firebase UID as Postgres ID
            email,
            fullName: name,
            avatarUrl: picture,
            authProvider,
          },
        });
      }
    } else {
      // Update existing user with fresh data from Firebase (like new avatar)
      user = await prisma.user.update({
        where: { id: uid },
        data: {
          fullName: name,
          avatarUrl: picture,
          authProvider,
        },
      });
    }

    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // Create the session cookie
    const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn });
    
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax' as const,
    };
    
    res.cookie('session', sessionCookie, options);
    
    return res.json({ status: 'success', user });
  } catch (error: any) {
    console.error('Session creation error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors });
    }
    return res.status(401).json({ error: 'UNAUTHORIZED REQUEST' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req: any, res: any) => {
  try {
    const sessionCookie = req.cookies.session || '';
    res.clearCookie('session');
    
    if (sessionCookie) {
      try {
        const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie);
        await authAdmin.revokeRefreshTokens(decodedClaims.sub);
      } catch (err) {
        // Ignore errors revoking token (might be expired already)
      }
    }
    
    return res.json({ status: 'success' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to logout' });
  }
});

// GET /api/auth/me
// Returns the currently logged in user based on the session cookie
router.get('/me', async (req: any, res: any) => {
  try {
    const sessionCookie = req.cookies.session || '';
    if (!sessionCookie) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    const user = await prisma.user.findUnique({
      where: { id: decodedClaims.sub },
    });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    return res.json({ user });
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
});

export default router;
