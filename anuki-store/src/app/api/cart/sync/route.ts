import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, items } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!items || items.length === 0) {
      // If cart is empty, delete the abandoned cart record if it exists
      await prisma.abandonedCart.deleteMany({
        where: { userId },
      });
      return NextResponse.json({ success: true, message: 'Cart cleared' });
    }

    // Upsert the abandoned cart
    const cart = await prisma.abandonedCart.upsert({
      where: { userId },
      update: { items },
      create: { userId, items },
    });

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error('Error syncing cart:', error);
    return NextResponse.json({ error: 'Failed to sync cart' }, { status: 500 });
  }
}
