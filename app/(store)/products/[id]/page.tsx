import React from 'react';
import { INITIAL_PRODUCTS } from '@/lib/seed-data';
import ProductDetailClient from './ProductDetailClient';

export function generateStaticParams() {
  const byId = INITIAL_PRODUCTS.map((prod) => ({ id: prod.id }));
  const bySlug = INITIAL_PRODUCTS.filter((prod) => prod.slug && prod.slug !== prod.id).map((prod) => ({ id: prod.slug }));
  return [...byId, ...bySlug];
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailClient productId={id} />;
}
