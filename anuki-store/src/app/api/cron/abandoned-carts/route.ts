import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_for_build');

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // Basic security check for cron endpoints (e.g. Vercel cron secret)
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find carts that haven't been updated in the last 4 hours
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const carts = await prisma.abandonedCart.findMany({
      where: {
        updatedAt: {
          lte: fourHoursAgo,
        }
      },
      include: {
        user: true,
      }
    });

    for (const cart of carts) {
      if (cart.user.email) {
        await resend.emails.send({
          from: 'Anuki Crochet <shop@anukicrochet.com>',
          to: cart.user.email,
          subject: 'Did you forget something? 🧶',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
              <h2>Hi ${cart.user.fullName},</h2>
              <p>We noticed you left some beautiful handmade items in your cart.</p>
              <p>Since our items are made to order, our capacity fills up quickly. Complete your order to secure your items!</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/cart" style="display: inline-block; background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Return to Cart
              </a>
            </div>
          `,
        });

        // Optionally, you might want to mark it as 'notified' to prevent spamming, 
        // for now we'll just delete the cart so we don't email them again for this specific session.
        await prisma.abandonedCart.delete({
          where: { id: cart.id }
        });
      }
    }

    return NextResponse.json({ success: true, processed: carts.length });
  } catch (error) {
    console.error('Error in abandoned carts cron:', error);
    return NextResponse.json({ error: 'Failed to process abandoned carts' }, { status: 500 });
  }
}
