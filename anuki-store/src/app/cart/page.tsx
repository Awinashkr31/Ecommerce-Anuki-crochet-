import CartClient from './CartClient';
import { prisma } from '@/lib/prisma';

export const revalidate = 86400; // 24 hours - cached on edge, reduces daily ISR writes dramatically

export default async function CartPage() {
  let crossSellProducts: any[] = [];
  try {
    const allProducts = await prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      take: 20,
      include: {
        category: true,
        variants: true,
        images: { orderBy: { order: 'asc' } },
      }
    });
    crossSellProducts = allProducts.sort(() => 0.5 - Math.random());
  } catch (err) {
    console.error('Error fetching cart cross-sell products:', err);
  }

  return <CartClient crossSellProducts={crossSellProducts} />;
}
