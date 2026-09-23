'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Phone,
  Package,
  Printer,
  ArrowRight,
  MapPin,
  Calendar,
  CreditCard,
  Building,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { getOrderById, getOrders } from '@/lib/db';
import { Order } from '@/lib/types';
import { formatPKR } from '@/lib/hash-utils';
import { useStoreSettings } from '@/context/StoreSettingsContext';

function OrderSuccessContent({ orderId }: { orderId: string }) {
  const { settings } = useStoreSettings();
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get('order') || searchParams.get('id');
  const targetId = queryOrderId || orderId;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (targetId && targetId !== 'latest' && targetId !== 'demo') {
      const found = getOrderById(targetId);
      if (found) {
        setOrder(found);
        return;
      }
    }
    const orders = getOrders();
    if (orders.length > 0) {
      setOrder(orders[0]);
    }
  }, [targetId]);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Order Information</h2>
        <p className="text-xs text-slate-500">
          No order could be loaded for ID &ldquo;{orderId}&rdquo;.
        </p>
        <Link
          href="/shop/"
          className="inline-block bg-zohan-red text-white text-xs font-semibold px-4 py-2 rounded-lg"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const paymentLabels: Record<string, string> = {
    cod: 'Cash on Delivery (COD)',
    jazzcash: 'JazzCash Direct Mobile Transfer',
    easypaisa: 'EasyPaisa Mobile Account',
    bank_transfer: 'Direct Corporate Bank Wire',
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Zohan Traders, I have placed order #${order.orderNumber} for total ${formatPKR(order.total)}. Customer: ${order.customerName}. Please confirm shipment.`
  );
  const whatsappUrl = `https://wa.me/${(settings.whatsapp || '923338586852').replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Success Hero */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
          Order Placed Successfully
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Thank You, {order.customerName}!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Your order tracking reference is <strong className="text-slate-900 font-mono">{order.orderNumber}</strong>. Our team has received your order details and is preparing it for fulfillment.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Confirm Order on WhatsApp</span>
          </a>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Printable Receipt Card */}
      <div id="printable-invoice-area" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900">
                ZOHAN <span className="text-zohan-red">TRADERS</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Jampur Road, DG Khan • Phone: {settings.phone}
            </p>
            <p className="text-[11px] text-slate-400">
              NTN: {settings.ntn} | STRN: {settings.strn}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs">
            <div className="text-slate-500">Order Reference:</div>
            <div className="text-sm font-mono font-bold text-slate-900">
              {order.orderNumber}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center sm:justify-end gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(order.created_at).toLocaleDateString('en-PK')}</span>
            </div>
            <div className="mt-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Status: {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pb-6 border-b border-slate-200">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Customer Details
            </span>
            <div className="font-bold text-slate-900 text-sm">{order.customerName}</div>
            <div className="text-slate-600 mt-0.5">Phone: {order.customerPhone}</div>
            {order.customerEmail && order.customerEmail !== 'N/A' && (
              <div className="text-slate-600">Email: {order.customerEmail}</div>
            )}
          </div>

          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Delivery Address & Payment
            </span>
            <div className="text-slate-800 font-medium">{order.deliveryAddress}</div>
            <div className="text-slate-600 font-semibold">{order.city}</div>
            <div className="text-slate-500 mt-1">
              Payment: <strong>{paymentLabels[order.paymentMethod] || order.paymentMethod}</strong>
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5">Item Description</th>
                <th className="py-2.5 text-center">Unit Price</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-semibold text-slate-900 pr-2">
                    {item.productName}
                    {item.selectedVariant && (
                      <span className="text-[10px] text-slate-500 block">
                        Variant: {item.selectedVariant}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-center text-slate-600">
                    {formatPKR(item.price)}
                  </td>
                  <td className="py-3 text-center font-bold text-slate-800">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right font-bold text-slate-900">
                    {formatPKR(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <div className="w-full sm:w-64 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatPKR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span className="font-semibold">-{formatPKR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span className="font-semibold text-slate-900">
                {order.shippingFee === 0 ? 'FREE' : formatPKR(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Payable:</span>
              <span className="text-zohan-red text-lg">{formatPKR(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home CTA */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-zohan-red transition-colors"
        >
          <span>&larr; Return to Home Page</span>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessClient({ orderId }: { orderId: string }) {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-20 text-center text-slate-500">
          Loading order receipt...
        </div>
      }
    >
      <OrderSuccessContent orderId={orderId} />
    </React.Suspense>
  );
}
