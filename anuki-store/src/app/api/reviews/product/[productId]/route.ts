import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const resolvedParams = await params;
    const reviews = await prisma.review.findMany({
      where: { 
        productId: resolvedParams.productId,
        approved: true 
      },
      include: {
        user: {
          select: {
            fullName: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json([]);
  }
}
