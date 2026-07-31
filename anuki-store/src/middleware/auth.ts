import { NextRequest, NextResponse } from 'next/server';
import { authAdmin } from '../lib/firebaseAdmin';
import { prisma } from '../lib/prisma';

export interface AuthContext {
  user: {
    userId: string;
    role: string;
  };
  params?: any;
}

export type AuthenticatedRouteHandler = (req: NextRequest, ctx: AuthContext) => Promise<NextResponse> | NextResponse;

export function withAuth(handler: AuthenticatedRouteHandler, allowedRoles?: string[]) {
  return async (req: NextRequest, ctx: any) => {
    const sessionCookie = req.cookies.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Access denied. No session cookie provided.' }, { status: 401 });
    }

    try {
      const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
      const user = await prisma.user.findUnique({
        where: { id: decodedClaims.sub },
        select: { id: true, role: true }
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found in database.' }, { status: 401 });
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden. Insufficient permissions.' }, { status: 403 });
      }

      const newCtx: AuthContext = {
        ...ctx,
        user: { userId: user.id, role: user.role }
      };

      return handler(req, newCtx);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 });
    }
  };
}
