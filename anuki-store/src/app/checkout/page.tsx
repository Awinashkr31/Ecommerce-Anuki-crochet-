import CheckoutClient from './CheckoutClient';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';


export const metadata: Metadata = {
  title: 'Checkout | Anuki Crochet',
};

const getStoreSettings = unstable_cache(
  async () => {
    return prisma.storeSettings.findMany();
  },
  ['store-settings-checkout-cache'],
  { revalidate: 3600 } // Cache for 1 hour
);

export default async function CheckoutPage() {
  const settingsRecords = await getStoreSettings();
  
  const settings = settingsRecords.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutClient settings={settings} />
    </Suspense>
  );
}
