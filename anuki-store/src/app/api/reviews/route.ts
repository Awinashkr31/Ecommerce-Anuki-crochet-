import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { productId, rating, comment, imageUrls, userId } = await request.json();
    
    if (!userId || !productId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: Number(rating),
        comment,
        imageUrls: imageUrls || [],
        approved: false // Reviews must be approved by admin
      }
    });

    return NextResponse.json({ success: true, message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Failed to submit review:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
