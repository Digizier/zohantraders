import React from 'react';
import OrderSuccessClient from './OrderSuccessClient';

export function generateStaticParams() {
  return [
    { id: 'latest' },
    { id: 'demo' },
  ];
}

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderSuccessClient orderId={id} />;
}
