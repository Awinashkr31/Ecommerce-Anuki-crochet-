import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.storeSettings.findMany();
    const map = settings.reduce((acc: Record<string, string>, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    return NextResponse.json({
      free_delivery_threshold: map.free_delivery_threshold || "799",
      delivery_charge: map.delivery_charge || "50",
      product_title_template: map.product_title_template || "{product_name} | Anuki Crochet",
      ...map
    });
  } catch (error) {
    return NextResponse.json({
      free_delivery_threshold: "799",
      delivery_charge: "50",
      product_title_template: "{product_name} | Anuki Crochet"
    });
  }
}
