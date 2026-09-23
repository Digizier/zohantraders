'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Filter,
  X,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Check,
  RotateCcw,
} from 'lucide-react';
import { getProducts, getCategories, subscribeToDb } from '@/lib/db';
import { Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/seed-data';

const PRODUCTS_PER_PAGE = 12;

function ShopContent({ initialCategoryParam }: { initialCategoryParam?: string }) {
  const searchParams = useSearchParams();
  const initialCategory = initialCategoryParam || searchParams.get('category') || 'all';
  const initialSub = searchParams.get('sub') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>(() => {
    const p = getProducts();
    return p.length > 0 ? p : INITIAL_PRODUCTS;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const c = getCategories();
    return c.length > 0 ? c : INITIAL_CATEGORIES;
  });

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSub, setSelectedSub] = useState<string>(initialSub);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const loadData = () => {
    setProducts(getProducts());
    setCategories(getCategories());
  };

  useEffect(() => {
    loadData();
    const unsubP = subscribeToDb('products', loadData);
    const unsubC = subscribeToDb('categories', loadData);
    return () => {
      unsubP();
      unsubC();
    };
  }, []);

  // Update if query params or initialCategoryParam change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    } else if (initialCategoryParam) {
      setSelectedCategory(initialCategoryParam);
    }
    const sub = searchParams.get('sub');
    if (sub) setSelectedSub(sub);
    const q = searchParams.get('q');
    if (q !== null) setSearchQuery(q);
  }, [searchParams, initialCategoryParam]);

  const activeCategoryObj = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
  }, [categories, selectedCategory]);

  const availableSubcategories = activeCategoryObj?.subcategories || [];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const matchesCategory =
          p.categoryId === selectedCategory ||
          categories.find((c) => c.slug === selectedCategory)?.id === p.categoryId;
        if (!matchesCategory) return false;
      }

      // Subcategory filter
      if (selectedSub !== 'all') {
        const matchesSub =
          p.subcategoryId === selectedSub ||
          activeCategoryObj?.subcategories.find((s) => s.slug === selectedSub || s.id === selectedSub)?.id ===
            p.subcategoryId ||
          categories
            .flatMap((c) => c.subcategories || [])
            .find((s) => s.slug === selectedSub || s.id === selectedSub)?.id === p.subcategoryId;
        if (!matchesSub) return false;
      }

      // In stock
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesBrand = p.brand?.toLowerCase().includes(q);
        const matchesDept = p.department?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesBrand && !matchesDept) return false;
      }

      return true;
    });
  }, [products, categories, selectedCategory, selectedSub, inStockOnly, searchQuery, activeCategoryObj]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'newest') {
      return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    if (sortBy === 'price-low') {
      return list.sort(
        (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
      );
    }
    if (sortBy === 'price-high') {
      return list.sort(
        (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
      );
    }
    if (sortBy === 'featured') {
      return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  // Reset page when any filter criteria changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSub, searchQuery, sortBy, inStockOnly]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return sortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('shop-products-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSub('all');
    setSearchQuery('');
    setInStockOnly(false);
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <div className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
          <Link href="/" className="hover:text-zohan-red">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Shop Catalog</span>
          {activeCategoryObj && (
            <>
              <span>/</span>
              <span className="text-zohan-red font-semibold">{activeCategoryObj.name}</span>
            </>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {activeCategoryObj ? activeCategoryObj.name : 'All Products & Materials'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {sortedProducts.length} certified items available for delivery across Pakistan
            </p>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter & Categories</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-zohan-red" />
                <span>Filters</span>
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] text-slate-500 hover:text-zohan-red flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Search within catalog */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Search Items
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Keyword search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zohan-red"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Category
              </label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSub('all');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex justify-between items-center ${
                    selectedCategory === 'all'
                      ? 'bg-zohan-red text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>All Categories</span>
                  <span>{products.length}</span>
                </button>
                {categories.map((cat) => {
                  const isSelected =
                    selectedCategory === cat.slug || selectedCategory === cat.id;
                  const count = products.filter((p) => p.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setSelectedSub('all');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex justify-between items-center ${
                        isSelected
                          ? 'bg-zohan-red text-white font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <span className={isSelected ? 'text-white' : 'text-slate-400'}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-categories if category selected */}
            {availableSubcategories.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Sub-Categories
                </label>
                <div className="space-y-1 pl-1">
                  <button
                    type="button"
                    onClick={() => setSelectedSub('all')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                      selectedSub === 'all'
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Subcategories</span>
                    {selectedSub === 'all' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {availableSubcategories.map((sub) => {
                    const isSubSelected =
                      selectedSub === sub.slug || selectedSub === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSelectedSub(sub.slug)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                          isSubSelected
                            ? 'bg-slate-800 text-white font-semibold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{sub.name}</span>
                        {isSubSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock filter */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-zohan-red focus:ring-zohan-red"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Catalog Column */}
        <div id="shop-products-anchor" className="col-span-1 md:col-span-3 space-y-6">
          {/* Top Sort and Bar */}
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-xs text-slate-600">
              Showing{' '}
              <strong>
                {sortedProducts.length === 0
                  ? 0
                  : `${(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–${Math.min(
                      currentPage * PRODUCTS_PER_PAGE,
                      sortedProducts.length
                    )}`}
              </strong>{' '}
              of <strong>{sortedProducts.length}</strong> results
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-zohan-red"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="featured">Featured First</option>
              </select>
            </div>
          </div>

          {/* Active filters pill list */}
          {(selectedCategory !== 'all' || selectedSub !== 'all' || searchQuery || inStockOnly) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-red-50 text-zohan-red text-xs px-2.5 py-1 rounded-full font-medium">
                  Category: {activeCategoryObj?.name || selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSub !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-full font-medium">
                  Sub: {selectedSub}
                  <button onClick={() => setSelectedSub('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-full font-medium">
                  &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-medium">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-zohan-red hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No matching products found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search query, clearing filters, or switching categories.
              </p>
              <button
                onClick={resetFilters}
                className="bg-zohan-red text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-zohan-red-dark transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Numeric Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500 order-2 sm:order-1">
                Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
                <strong className="text-slate-800">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-1.5 order-1 sm:order-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-zohan-red text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Filter Modal / Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex sm:pl-10">
            <div className="w-full max-w-[85vw] sm:max-w-xs bg-white shadow-2xl p-4 sm:p-5 flex flex-col justify-between">
              <div className="space-y-6 overflow-y-auto pr-1">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-zohan-red" />
                    <span>Filter Products</span>
                  </h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Categories (buttons, no premature link navigations!) */}
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                    Select Category
                  </label>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedSub('all');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        selectedCategory === 'all'
                          ? 'bg-zohan-red text-white font-bold'
                          : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(c.slug);
                          setSelectedSub('all');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                          selectedCategory === c.slug || selectedCategory === c.id
                            ? 'bg-zohan-red text-white font-bold'
                            : 'bg-slate-50 text-slate-700'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategories */}
                {availableSubcategories.length > 0 && (
                  <div>
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                      Subcategories
                    </label>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setSelectedSub('all')}
                        className={`w-full text-left px-3 py-1.5 rounded text-xs ${
                          selectedSub === 'all'
                            ? 'bg-slate-800 text-white font-bold'
                            : 'text-slate-600'
                        }`}
                      >
                        All
                      </button>
                      {availableSubcategories.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedSub(s.slug)}
                          className={`w-full text-left px-3 py-1.5 rounded text-xs ${
                            selectedSub === s.slug
                              ? 'bg-slate-800 text-white font-bold'
                              : 'text-slate-600'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-zohan-red text-white py-3 rounded-xl font-bold text-sm shadow"
                >
                  Apply Filters ({sortedProducts.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage({ initialCategoryParam }: { initialCategoryParam?: string }) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
          Loading catalog...
        </div>
      }
    >
      <ShopContent initialCategoryParam={initialCategoryParam} />
    </Suspense>
  );
}
