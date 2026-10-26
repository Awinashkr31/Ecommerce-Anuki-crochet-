import CheckoutClient from './CheckoutClient';
import CheckoutSkeleton from './components/CheckoutSkeleton';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Checkout',
};

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  let settings: Record<string, string> = {
    free_delivery_threshold: '799',
    delivery_charge: '50',
    cod_extra_charge: '40',
    min_order_value: '0',
    cod_payment_status: 'active',
  };

  try {
    const settingsRecords = await prisma.storeSettings.findMany({
      select: {
        key: true,
        value: true,
      },
    });

    if (settingsRecords && settingsRecords.length > 0) {
      settings = settingsRecords.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, { ...settings });
    }
  } catch (err) {
    console.error('Failed to load store settings for checkout, using defaults:', err);
  }

  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutClient settings={settings} />
    </Suspense>
  );
}
