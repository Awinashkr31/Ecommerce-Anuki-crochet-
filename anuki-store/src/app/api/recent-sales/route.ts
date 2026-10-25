import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getRelativeTime(date: Date): string {
  const now = Date.now();
  const diffSec = Math.floor((now - date.getTime()) / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

export async function GET() {
  try {
    // Only query real paid orders (payment SUCCESS or status PROCESSING/SHIPPED/DELIVERED)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentOrders: any[] = await prisma.order.findMany({
      where: {
        OR: [
          { payment: { status: "SUCCESS" } },
          { status: { in: ["PROCESSING", "SHIPPED", "DELIVERED"] } },
        ],
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            fullName: true,
            addresses: { take: 1, select: { city: true } },
          },
        },
        items: {
          take: 1,
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    name: true,
                    images: { take: 1, select: { url: true }, orderBy: { order: "asc" } },
                  },
                },
              },
            },
          },
        },
      },
    });

    const sanitized = recentOrders
      .map((o: any) => {
        // Extract real first name
        let firstName = o.user?.fullName ? o.user.fullName.trim().split(" ")[0] : null;
        if (!firstName && o.internalNotes) {
          const match = o.internalNotes.match(/Name:\s*([^,\n]+)/i);
          if (match && match[1]) {
            firstName = match[1].trim().split(" ")[0];
          }
        }

        // Extract real city
        let city = o.user?.addresses?.[0]?.city || null;
        if (!city && o.internalNotes) {
          const cityMatch = o.internalNotes.match(/Shipping Address:[^,]+,[^,]+,\s*([^,]+),/i);
          if (cityMatch && cityMatch[1]) {
            city = cityMatch[1].trim();
          }
        }

        const product = o.items[0]?.variant?.product;
        const productName = product?.name || null;
        const productImage = product?.images?.[0]?.url || null;

        if (!firstName || !city || !productName) {
          return null;
        }

        return {
          id: o.id.slice(0, 8),
          firstName,
          city,
          productName,
          productImage,
          timeAgo: getRelativeTime(new Date(o.createdAt)),
        };
      })
      .filter(Boolean);

    return NextResponse.json(sanitized);
  } catch (error) {
    console.error("Failed to fetch real sales pings:", error);
    return NextResponse.json([]);
  }
}
