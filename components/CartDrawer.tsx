'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { formatPKR } from '@/lib/hash-utils';
import { getCouponByCode } from '@/lib/db';
import { Coupon } from '@/lib/types';

export function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartSubtotal } = useCart();
  const { settings } = useStoreSettings();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold || 5000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;

    const coupon = getCouponByCode(couponCode);
    if (!coupon) {
      setCouponError('Invalid or expired promo code.');
      return;
    }

    if (cartSubtotal < coupon.minSpend) {
      setCouponError(`Minimum spend of ${formatPKR(coupon.minSpend)} required for this coupon.`);
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
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const estimatedShipping = isFreeShipping ? 0 : settings.baseShippingFee;
  const estimatedTotal = finalSubtotal + estimatedShipping;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] max-w-full bg-white shadow-2xl flex flex-col z-50 overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-zohan-red" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Your Shopping Cart</h2>
            <span className="text-xs bg-red-100 text-zohan-red px-2 py-0.5 rounded-full font-bold">
              {cart.length}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

          {/* Free Shipping Progress */}
          <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-red-50/50 border-b border-red-100/60">
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              {isFreeShipping ? (
                <span className="text-emerald-700 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free Delivery Unlocked!
                </span>
              ) : (
                <span className="text-slate-700">
                  Add <strong className="text-zohan-red">{formatPKR(amountNeeded)}</strong> for FREE Delivery
                </span>
              )}
              <span className="text-slate-500 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Browse our high quality IT, security, construction, and stationery products to place your order.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-zohan-red text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:bg-zohan-red-dark transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = item.product.salePrice ?? item.product.price;
                const imageSrc = item.product.images?.[0] || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=200&auto=format&fit=crop';
                return (
                  <div key={item.product.id + (item.selectedVariant || '')} className="py-3 flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200/60">
                      <Image
                        src={imageSrc}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-semibold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs text-slate-500 mt-0.5">
                        {formatPKR(itemPrice)}
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-xs font-bold text-slate-900">
                          {formatPKR(itemPrice * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
              {/* Promo code form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1 min-w-0">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full text-xs pl-8 pr-2.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zohan-red uppercase font-medium bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="flex-shrink-0 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}

              {appliedCoupon && (
                <div className="flex justify-between items-center text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                  <span className="flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Coupon: {appliedCoupon.code}
                  </span>
                  <span>-{formatPKR(discountAmount)}</span>
                </div>
              )}

              {/* Price breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPKR(cartSubtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatPKR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {isFreeShipping ? 'FREE' : formatPKR(estimatedShipping)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-zohan-red text-base font-black">{formatPKR(estimatedTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1">
                <Link
                  href="/checkout/"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-zohan-red hover:bg-zohan-red-dark text-white py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
