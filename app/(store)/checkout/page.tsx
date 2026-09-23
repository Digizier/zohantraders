'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { formatPKR } from '@/lib/hash-utils';
import { saveOrder, getCouponByCode } from '@/lib/db';
import { Order, PaymentMethod, Coupon } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart } = useCart();
  const { settings } = useStoreSettings();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('DG Khan');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    settings.codEnabled ? 'cod' : 'jazzcash'
  );

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const freeThreshold = settings.freeShippingThreshold || 5000;
  const isFreeShipping = cartSubtotal >= freeThreshold;
  const shippingFee = isFreeShipping ? 0 : settings.baseShippingFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;

    const coupon = getCouponByCode(couponCode);
    if (!coupon) {
      setCouponError('Invalid or expired coupon.');
      return;
    }

    if (cartSubtotal < coupon.minSpend) {
      setCouponError(`Min spend ${formatPKR(coupon.minSpend)} required for this coupon.`);
      return;
    }

    setAppliedCoupon(coupon);
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? Math.round((cartSubtotal * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;

  const finalSubtotal = Math.max(0, cartSubtotal - discountAmount);
  const totalAmount = finalSubtotal + shippingFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `ZT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerName,
      customerPhone,
      customerEmail: customerEmail || 'N/A',
      deliveryAddress,
      city,
      notes: notes || undefined,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.salePrice ?? item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0] || '',
        selectedVariant: item.selectedVariant,
      })),
      subtotal: cartSubtotal,
      shippingFee,
      discount: discountAmount,
      total: totalAmount,
      paymentMethod,
      status: 'Pending',
      couponCode: appliedCoupon?.code,
      created_at: new Date().toISOString(),
    };

    saveOrder(newOrder);
    clearCart();

    // Redirect to Order Confirmation (pre-rendered static path with order query)
    router.push(`/order-success/latest/?order=${orderId}`);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">
          You have no items in your cart to checkout. Please explore our store catalog first.
        </p>
        <Link
          href="/shop/"
          className="inline-block bg-zohan-red text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:bg-zohan-red-dark transition-colors"
        >
          Go to Shop Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Secure Procurement Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete your delivery details and choose your preferred settlement option.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Details & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer & Address Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-zohan-red" />
              <span>1. Delivery & Contact Information</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Full Name / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mehmood"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zohan-red"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0333 1234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zohan-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. info@business.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zohan-red"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    City / Tehsil *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DG Khan, Multan, Kot Chutta"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zohan-red"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Complete Delivery Address *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Street address, shop/plot number, landmark..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zohan-red"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Delivery Notes / Specific Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before delivery, deliver between 10am-4pm"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zohan-red"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-zohan-red" />
              <span>2. Select Payment Method</span>
            </h3>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              {settings.codEnabled && (
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-zohan-red bg-red-50/30'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-zohan-red focus:ring-zohan-red"
                  />
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                      Cash on Delivery (COD)
                    </strong>
                    <span className="text-[11px] text-slate-500 block">
                      Pay cash to the courier representative when the parcel arrives at your doorstep.
                    </span>
                  </div>
                </label>
              )}

              {/* JazzCash */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === 'jazzcash'
                    ? 'border-zohan-red bg-red-50/30'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="jazzcash"
                  checked={paymentMethod === 'jazzcash'}
                  onChange={() => setPaymentMethod('jazzcash')}
                  className="mt-1 text-zohan-red focus:ring-zohan-red"
                />
                <div className="flex-1">
                  <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                    JazzCash Direct Mobile Transfer
                  </strong>
                  <span className="text-[11px] text-slate-500 block">
                    Account: <strong className="text-slate-800">{settings.jazzCash.accountNumber}</strong> ({settings.jazzCash.accountTitle})
                  </span>
                  {paymentMethod === 'jazzcash' && (
                    <div className="mt-2 p-2.5 bg-amber-50 rounded-lg text-[11px] text-amber-900 border border-amber-200">
                      {settings.jazzCash.instruction}
                    </div>
                  )}
                </div>
              </label>

              {/* EasyPaisa */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === 'easypaisa'
                    ? 'border-zohan-red bg-red-50/30'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="easypaisa"
                  checked={paymentMethod === 'easypaisa'}
                  onChange={() => setPaymentMethod('easypaisa')}
                  className="mt-1 text-zohan-red focus:ring-zohan-red"
                />
                <div className="flex-1">
                  <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                    EasyPaisa Mobile Account
                  </strong>
                  <span className="text-[11px] text-slate-500 block">
                    Account: <strong className="text-slate-800">{settings.easyPaisa.accountNumber}</strong> ({settings.easyPaisa.accountTitle})
                  </span>
                  {paymentMethod === 'easypaisa' && (
                    <div className="mt-2 p-2.5 bg-emerald-50 rounded-lg text-[11px] text-emerald-900 border border-emerald-200">
                      {settings.easyPaisa.instruction}
                    </div>
                  )}
                </div>
              </label>

              {/* Bank Transfer */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-zohan-red bg-red-50/30'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="mt-1 text-zohan-red focus:ring-zohan-red"
                />
                <div className="flex-1">
                  <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                    Direct Corporate Bank Wire (IBAN)
                  </strong>
                  <span className="text-[11px] text-slate-500 block">
                    {settings.bankTransfer.bankName} — A/C: {settings.bankTransfer.accountNumber}
                  </span>
                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg text-[11px] text-blue-900 border border-blue-200 space-y-1">
                      <div><strong>Bank:</strong> {settings.bankTransfer.bankName}</div>
                      <div><strong>Title:</strong> {settings.bankTransfer.accountTitle}</div>
                      <div><strong>IBAN:</strong> {settings.bankTransfer.iban}</div>
                      <div><strong>Branch:</strong> {settings.bankTransfer.branch}</div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-semibold text-slate-500">
                {cart.length} item(s)
              </span>
            </h3>

            {/* Item list */}
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => {
                const price = item.product.salePrice ?? item.product.price;
                const imageSrc = item.product.images?.[0] || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=200&auto=format&fit=crop';
                return (
                  <div key={item.product.id} className="py-3 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                      <Image
                        src={imageSrc}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-slate-500">
                        Qty: {item.quantity} × {formatPKR(price)}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      {formatPKR(price * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon Code Form */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zohan-red uppercase font-semibold"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-slate-900 transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-[11px] text-emerald-700 mt-1 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Coupon {appliedCoupon.code} applied!
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPKR(cartSubtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-{formatPKR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-slate-900">
                  {isFreeShipping ? (
                    <strong className="text-emerald-600">FREE Delivery</strong>
                  ) : (
                    formatPKR(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Payable</span>
                <span className="text-zohan-red text-lg">{formatPKR(totalAmount)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-zohan-red hover:bg-zohan-red-dark text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official FBR Sales Tax Registered Invoice Included</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
