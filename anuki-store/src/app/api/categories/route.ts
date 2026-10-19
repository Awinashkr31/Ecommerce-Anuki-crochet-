import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        bannerUrl: true,
        description: true,
        isActive: true,
        parentId: true,
        _count: {
          select: {
            products: {
              where: { status: 'PUBLISHED' }
            }
          }
        },
        products: {
          where: { status: 'PUBLISHED' },
          take: 1,
          orderBy: { basePrice: 'asc' },
          select: {
            basePrice: true,
            salePrice: true,
            images: {
              take: 1,
              orderBy: { order: 'asc' },
              select: { url: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json([]);
  }
}
