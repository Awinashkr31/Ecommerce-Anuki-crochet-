import CheckoutClient from './CheckoutClient';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Checkout | Anuki Crochet',
};

export default async function CheckoutPage() {
  const settingsRecords = await prisma.storeSettings.findMany();
  
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
