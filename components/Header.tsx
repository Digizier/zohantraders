'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Shield,
  Layers,
  Award,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { INITIAL_CATEGORIES } from '@/lib/seed-data';
import { getProducts, subscribeToDb } from '@/lib/db';
import { Product } from '@/lib/types';
import { formatPKR } from '@/lib/hash-utils';

export function Header() {
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();
  const { settings } = useStoreSettings();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Real-time Live Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProducts(getProducts());
    const unsub = subscribeToDb('products', () => {
      setProducts(getProducts());
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(target)
      ) {
        setSearchDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.department?.toLowerCase().includes(q) ||
          p.categoryId.toLowerCase().includes(q)
        );
      })
      .slice(0, 6);
  }, [products, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchDropdownOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const toggleCategory = (catId: string) => {
    setExpandedCategory((prev) => (prev === catId ? null : catId));
  };

  const renderSearchDropdown = () => {
    if (!searchDropdownOpen || !searchQuery.trim()) return null;

    return (
      <div className="absolute left-0 right-0 top-full mt-2 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 overflow-hidden divide-y divide-slate-100 max-h-96 overflow-y-auto">
        <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center">
          <span>Search Results ({searchResults.length})</span>
          <button
            type="button"
            onClick={() => setSearchDropdownOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
            aria-label="Close search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {searchResults.length > 0 ? (
          <>
            <div className="divide-y divide-slate-100">
              {searchResults.map((p) => {
                const price = p.salePrice ?? p.price;
                const img =
                  p.images?.[0] ||
                  'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=200&auto=format&fit=crop';
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}/`}
                    onClick={() => {
                      setSearchDropdownOpen(false);
                      setSearchQuery('');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
                      <Image
                        src={img}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 group-hover:text-zohan-red truncate">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-medium truncate">
                          {p.brand || p.department?.replace('ZOHAN ', '')}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold flex-shrink-0">
                          {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-zohan-red">{formatPKR(price)}</span>
                      {p.salePrice && p.salePrice < p.price && (
                        <div className="text-[10px] text-slate-400 line-through">
                          {formatPKR(p.price)}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="p-2 bg-slate-50">
              <Link
                href={`/shop/?q=${encodeURIComponent(searchQuery.trim())}`}
                onClick={() => {
                  setSearchDropdownOpen(false);
                  setMobileMenuOpen(false);
                }}
                className="block text-center text-xs font-bold text-zohan-red hover:underline py-1"
              >
                View all results in Shop &rarr;
              </Link>
            </div>
          </>
        ) : (
          <div className="p-4 text-center">
            <p className="text-xs text-slate-600">
              No products found matching &ldquo;{searchQuery}&rdquo;
            </p>
            <Link
              href="/shop/"
              onClick={() => {
                setSearchDropdownOpen(false);
                setMobileMenuOpen(false);
              }}
              className="text-[11px] text-zohan-red font-semibold hover:underline mt-1 inline-block"
            >
              Browse entire product catalog &rarr;
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-slate-200">
      {/* Top Utility Bar */}
      <div className="bg-zohan-dark text-slate-300 text-xs py-2 px-3 sm:px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Address & Phone (Single clean line on mobile) */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <span className="flex items-center gap-1 text-slate-300 font-medium truncate max-w-[190px] sm:max-w-none text-[11px] sm:text-xs">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zohan-gold flex-shrink-0" />
              <span className="truncate">{settings.address || 'Jampur Road, DG Khan, Pakistan'}</span>
            </span>
            <span className="text-slate-600">|</span>
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1 text-zohan-gold hover:text-white font-bold transition-colors flex-shrink-0 text-[11px] sm:text-xs"
            >
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zohan-red flex-shrink-0" />
              <span>{settings.phone}</span>
            </a>
            <span className="hidden lg:inline-block text-slate-600">|</span>
            <span className="hidden lg:inline-block text-slate-400">
              NTN: <strong className="text-slate-200">{settings.ntn}</strong> | STRN: <strong className="text-slate-200">{settings.strn}</strong>
            </span>
          </div>

          {/* Desktop-Only Badges & Admin Link (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-4 text-[11px]">
            <span className="text-zohan-gold font-semibold tracking-wide">
              Official Gov & Corporate Contractor Since 2017
            </span>
            <Link
              href="/admin/"
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-slate-500 px-2 py-0.5 rounded text-[11px]"
              title="Admin Portal (Desktop Only)"
            >
              <Lock className="w-3 h-3 text-zohan-red" />
              <span>Staff Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0 flex-1">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0 bg-transparent">
              <Image
                src="/logo.jpg"
                alt="Zohan Traders Logo"
                fill
                className="object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0 justify-center">
              <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 group-hover:text-zohan-red transition-colors flex items-center leading-tight truncate">
                ZOHAN <span className="text-zohan-red ml-1.5">TRADERS</span>
              </span>
              <span className="text-[10px] sm:text-xs text-slate-600 font-semibold tracking-tight truncate mt-0.5">
                Security • IT • Construction • Corporate Supplies
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div ref={desktopSearchRef} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search CCTV, CAT6, Bricks, Chairs, Paper..."
                value={searchQuery}
                onFocus={() => setSearchDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                className="w-full text-xs sm:text-sm pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-zohan-red/50 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-zohan-red text-white p-2 rounded-full hover:bg-zohan-red-dark transition-colors"
                aria-label="Submit search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
            {renderSearchDropdown()}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Direct Helpline Button (Desktop) */}
            <a
              href={`https://wa.me/${(settings.whatsapp || '923338586852').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 border border-emerald-500/30 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-800 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Inquiries</span>
            </a>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-800 transition-colors flex items-center justify-center border border-slate-200/80"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-5 h-5 text-slate-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-zohan-red text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white animate-scale">
                  {cartCount}
                </span>
              )}
            </button>

            {/* High-Contrast Visible Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-xl md:hidden flex items-center justify-center shadow-sm flex-shrink-0 transition-transform active:scale-95"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.5]" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div ref={mobileSearchRef} className="flex md:hidden mt-3 relative">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              placeholder="Search all products & materials..."
              value={searchQuery}
              onFocus={() => setSearchDropdownOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchDropdownOpen(true);
              }}
              className="w-full text-xs pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zohan-red"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-zohan-red text-white p-1.5 rounded-md hover:bg-zohan-red-dark"
              aria-label="Submit search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
          {renderSearchDropdown()}
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:block bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-1">
            <Link
              href="/"
              className="py-3 px-3 hover:text-zohan-gold hover:bg-slate-800 transition-colors rounded-t"
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 py-3 px-3 hover:text-zohan-gold hover:bg-slate-800 transition-colors"
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              >
                <Layers className="w-3.5 h-3.5 text-zohan-red" />
                <span>Categories</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute left-0 top-full w-72 bg-white text-slate-800 shadow-2xl rounded-b-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                  {INITIAL_CATEGORIES.map((cat) => (
                    <div key={cat.id} className="border-b border-slate-50 last:border-0">
                      <Link
                        href={`/shop/${cat.slug}/`}
                        onClick={() => setCategoriesDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-slate-50 text-slate-800 font-bold hover:text-zohan-red text-xs transition-colors"
                      >
                        {cat.name}
                      </Link>
                      <div className="pl-6 pr-4 pb-1 space-y-0.5">
                        {cat.subcategories.slice(0, 3).map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/shop/${cat.slug}/?sub=${sub.slug}`}
                            onClick={() => setCategoriesDropdownOpen(false)}
                            className="block text-[11px] text-slate-500 hover:text-slate-800 transition-colors truncate"
                          >
                            • {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="px-4 pt-2 pb-1 bg-slate-50 mt-1 border-t border-slate-100">
                    <Link
                      href="/shop/"
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="block text-center text-xs text-zohan-red font-bold hover:underline"
                    >
                      View All Products & Categories &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/shop/"
              className="py-3 px-3 hover:text-zohan-gold hover:bg-slate-800 transition-colors"
            >
              All Products
            </Link>

            <Link
              href="/departments/"
              className="py-3 px-3 hover:text-zohan-gold hover:bg-slate-800 transition-colors"
            >
              Departments
            </Link>

            <Link
              href="/clients/"
              className="py-3 px-3 hover:text-zohan-gold hover:bg-slate-800 transition-colors"
            >
              Corporate Clients
            </Link>

            <Link
              href="/why-choose-us/"
              className="py-3 px-3 hover:text-zohan-gold hover:bg-slate-800 transition-colors"
            >
              Why Choose Us
            </Link>

            <Link
              href="/about/"
              className="py-3 px-3 hover:text-zohan-gold hover:bg-slate-800 transition-colors"
            >
              About Us
            </Link>

            <Link
              href="/contact/"
              className="py-3 px-3 hover:text-zohan-gold hover:bg-slate-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>

          <div className="text-[11px] text-slate-400 py-3 hidden lg:block">
            <span>Customer Service: </span>
            <strong className="text-white">{settings.phone}</strong>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-white border-t border-slate-800 px-4 py-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold hover:text-zohan-gold border-b border-slate-800"
          >
            Home
          </Link>
          <Link
            href="/shop/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold hover:text-zohan-gold border-b border-slate-800"
          >
            Product Catalog
          </Link>

          {/* Categories in mobile with Expandable Subcategories Accordion */}
          <div className="py-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
              Product Categories
            </span>
            <div className="space-y-1">
              {INITIAL_CATEGORIES.map((cat) => {
                const isExpanded = expandedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    className="rounded-lg bg-slate-800/40 border border-slate-800/80 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-3 py-2">
                      <Link
                        href={`/shop/${cat.slug}/`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xs font-bold text-slate-200 hover:text-zohan-gold flex-1 truncate"
                      >
                        {cat.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700/60 transition-colors ml-2"
                        aria-label={`Toggle ${cat.name} subcategories`}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-zohan-gold" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </div>

                    {/* Expandable Accordion Subcategories */}
                    {isExpanded && (
                      <div className="bg-slate-950/70 px-3 py-2 border-t border-slate-800/80 space-y-1">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/shop/${cat.slug}/?sub=${sub.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-[11px] text-slate-300 hover:text-zohan-gold transition-colors pl-2.5 py-1 border-l-2 border-slate-700 hover:border-zohan-red truncate"
                          >
                            {sub.name}
                          </Link>
                        ))}
                        <Link
                          href={`/shop/${cat.slug}/`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-[11px] text-zohan-red font-semibold hover:underline pt-1.5 pl-2.5"
                        >
                          View all in {cat.name} &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href="/departments/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold hover:text-zohan-gold border-b border-slate-800"
          >
            4 Core Departments
          </Link>
          <Link
            href="/clients/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold hover:text-zohan-gold border-b border-slate-800"
          >
            Corporate Clients
          </Link>
          <Link
            href="/why-choose-us/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold hover:text-zohan-gold border-b border-slate-800"
          >
            Why Choose Us
          </Link>
          <Link
            href="/about/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold hover:text-zohan-gold border-b border-slate-800"
          >
            About Us
          </Link>
          <Link
            href="/contact/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold hover:text-zohan-gold border-b border-slate-800"
          >
            Contact & Location
          </Link>

          <div className="pt-3 flex justify-between items-center text-xs text-slate-400 border-t border-slate-800">
            <span className="text-[11px] text-slate-400">DG Khan, Pakistan</span>
            <a
              href={`tel:${settings.phone}`}
              className="text-zohan-gold font-bold flex items-center gap-1 hover:text-white"
            >
              <Phone className="w-3.5 h-3.5 text-zohan-red" />
              <span>{settings.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
