'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { getProductRating, formatPKR } from '@/lib/hash-utils';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { rating, reviewCount } = getProductRating(product.slug || product.id);

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const currentPrice = product.salePrice ?? product.price;
  const initialImage = product.images?.[0] || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=800&auto=format&fit=crop';
  const [imgSrc, setImgSrc] = React.useState(initialImage);

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Badges */}
      <div className="absolute top-1.5 left-1.5 z-10 flex flex-col gap-1">
        {hasDiscount && (
          <span className="bg-zohan-red text-white text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
        {product.isNew && (
          <span className="bg-zohan-dark text-white text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded">
            NEW
          </span>
        )}
      </div>

      {product.department && (
        <span className="absolute top-1.5 right-1.5 z-10 bg-slate-900/85 backdrop-blur-sm text-slate-200 text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded max-w-[80px] sm:max-w-none truncate">
          {product.brand || product.department.replace('ZOHAN ', '')}
        </span>
      )}

      {/* Image Container */}
      <Link
        href={`/products/${product.id}/`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-50"
      >
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={() => setImgSrc('https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop')}
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
          <span className="bg-white/95 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-zohan-red" /> Quick View
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1 sm:mb-1.5">
          <div className="flex items-center text-amber-500">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-slate-800">{rating}</span>
          <span className="text-[10px] sm:text-xs text-slate-400">({reviewCount})</span>
        </div>

        {/* Product Title */}
        <Link
          href={`/products/${product.id}/`}
          className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-zohan-red line-clamp-2 transition-colors mb-1 sm:mb-2 leading-snug min-h-[2rem] sm:min-h-[2.5rem]"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Stock & Availability */}
        <div className="text-[10px] sm:text-[11px] mb-2 sm:mb-3">
          {product.stock > 0 ? (
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> In Stock ({product.stock})
            </span>
          ) : (
            <span className="text-rose-600 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-1 sm:gap-2">
          <div className="min-w-0">
            <div className="text-xs sm:text-base font-bold text-slate-900 leading-tight truncate">
              {formatPKR(currentPrice)}
            </div>
            {hasDiscount && (
              <div className="text-[10px] sm:text-xs text-slate-400 line-through truncate">
                {formatPKR(product.price)}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className="flex-shrink-0 flex items-center justify-center gap-1 bg-zohan-red hover:bg-zohan-red-dark text-white p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add to Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
