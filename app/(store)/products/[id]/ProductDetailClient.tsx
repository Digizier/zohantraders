'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Phone,
  ShoppingCart,
  Zap,
  ArrowRight,
  Share2,
  Check,
  Building,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { getProductById, getProductBySlug, getProducts, subscribeToDb } from '@/lib/db';
import { getProductRating, formatPKR } from '@/lib/hash-utils';
import { useCart } from '@/context/CartContext';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { ProductCard } from '@/components/ProductCard';

export default function ProductDetailClient({ productId }: { productId: string }) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const { settings } = useStoreSettings();

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const loadData = () => {
    const p = getProductById(productId) || getProductBySlug(productId);
    const list = getProducts();
    setProduct(p);
    setAllProducts(list);
    if (p && p.images && p.images.length > 0) {
      setSelectedImage(p.images[0]);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToDb('products', loadData);
    return unsub;
  }, [productId]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested product ID could not be loaded or may have been removed.
        </p>
        <Link
          href="/shop/"
          className="inline-block bg-zohan-red text-white text-xs font-semibold px-4 py-2 rounded-lg"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const { rating, reviewCount } = getProductRating(product.slug || product.id);
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const currentPrice = product.salePrice ?? product.price;

  // Real related products matching by category
  const relatedProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCartOpen(false);
    router.push('/checkout/');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Zohan Traders, I am interested in: ${product.name} (PKR ${currentPrice.toLocaleString('en-PK')}). Please provide procurement details.`
  );
  const whatsappUrl = `https://wa.me/${(settings.whatsapp || '923338586852').replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-zohan-red">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop/" className="hover:text-zohan-red">
          Shop
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
            <Image
              src={selectedImage || product.images?.[0] || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=1000&auto=format&fit=crop'}
              alt={product.name}
              fill
              priority
              className="object-cover transition-all duration-300"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-zohan-red text-white text-xs font-bold px-3 py-1 rounded-md shadow-md">
                Special Price
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-4 right-4 bg-zohan-dark text-white text-xs font-bold px-3 py-1 rounded-md shadow-md uppercase">
                New
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === img
                      ? 'border-zohan-red shadow-md scale-95'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Buying Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              {product.department && (
                <span className="text-xs font-bold uppercase tracking-wider text-zohan-red bg-red-50 px-2.5 py-1 rounded-md">
                  {product.department}
                </span>
              )}
              <button
                onClick={handleShare}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
                title="Share link"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {product.name}
            </h1>

            {/* Rating & Brand */}
            <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <div className="flex text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <strong className="text-slate-900 font-bold">{rating}</strong>
                <span>({reviewCount} reviews)</span>
              </div>
              <span>•</span>
              {product.brand && (
                <span>
                  Brand: <strong className="text-slate-900">{product.brand}</strong>
                </span>
              )}
              <span>•</span>
              <span>
                Status:{' '}
                {product.stock > 0 ? (
                  <strong className="text-emerald-600">In Stock ({product.stock} units)</strong>
                ) : (
                  <strong className="text-rose-600">Sold Out</strong>
                )}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                {formatPKR(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPKR(product.price)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Prices inclusive of applicable local commercial taxes. Volume procurement available.
            </p>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity & Buy Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-slate-100 text-slate-600 font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-slate-900 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 hover:bg-slate-100 text-slate-600 font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex items-center justify-center gap-2 bg-zohan-red hover:bg-zohan-red-dark text-white py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>Instant Checkout</span>
              </button>
            </div>

            {/* Direct WhatsApp Quote Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Inquire via WhatsApp Desk</span>
            </a>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-zohan-red mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-800">12-Mo Warranty</div>
              <div className="text-[10px] text-slate-500">Official replacement</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Truck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-800">Fast Delivery</div>
              <div className="text-[10px] text-slate-500">DG Khan & Nationwide</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-800">100% Genuine</div>
              <div className="text-[10px] text-slate-500">Authorized Stock</div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Features Tabs/Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-slate-200">
        {/* Features list */}
        {product.features && product.features.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-l-4 border-zohan-red pl-3">
              Key Engineering Features
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technical specs table */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-l-4 border-zohan-gold pl-3">
              Technical Specifications
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="py-2.5 flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">{key}</span>
                  <span className="font-bold text-slate-900 text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Real Related Products (Matched by Category) */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zohan-red">
                Similar Supplies
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Related Category Items
              </h3>
            </div>
            <Link
              href="/shop/"
              className="text-xs font-bold text-zohan-red hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
