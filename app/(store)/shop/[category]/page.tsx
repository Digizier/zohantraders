import React, { Suspense } from 'react';
import { INITIAL_CATEGORIES } from '@/lib/seed-data';
import ShopPage from '../page';

export function generateStaticParams() {
  return INITIAL_CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading category...</div>}>
      <ShopPage initialCategoryParam={resolvedParams.category} />
    </Suspense>
  );
}
