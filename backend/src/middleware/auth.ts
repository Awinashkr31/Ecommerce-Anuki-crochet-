import { Request, Response, NextFunction } from 'express';
import { authAdmin } from '../lib/firebaseAdmin';
import { prisma } from '../lib/prisma';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const sessionCookie = req.cookies.session;
  
  if (!sessionCookie) {
    return res.status(401).json({ error: 'Access denied. No session cookie provided.' });
  }

  try {
    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    
    const user = await prisma.user.findUnique({
      where: { id: decodedClaims.sub },
      select: { id: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found in database.' });
    }

    req.user = {
      userId: user.id,
      role: user.role,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired session.' });
  }
};

export const requireRoles = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Access denied. No user data.' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
    }
    
    next();
  };
};
