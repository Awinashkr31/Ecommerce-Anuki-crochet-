import CartClient from './CartClient';
import { prisma } from '@/lib/prisma';

export const revalidate = 86400; // 24 hours - cached on edge, reduces daily ISR writes dramatically

export default async function CartPage() {
  const allProducts = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    take: 20,
    include: {
      category: true,
      variants: true,
      images: { orderBy: { order: 'asc' } },
    }
  });

  // Basic random shuffle on the server side
  const crossSellProducts = allProducts.sort(() => 0.5 - Math.random());

  return <CartClient crossSellProducts={crossSellProducts} />;
}
