'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Cpu,
  Layers,
  FileText,
  Armchair,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Award,
  Clock,
  Sparkles,
  PhoneCall,
  Wrench,
  Building,
} from 'lucide-react';
import { getBanners, getProducts, getCategories, subscribeToDb } from '@/lib/db';
import { HeroBanner, Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { CORPORATE_CLIENTS, BRAND_PARTNERS, INITIAL_BANNERS, INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/seed-data';

export default function HomePage() {
  const [banners, setBanners] = useState<HeroBanner[]>(() => {
    const loaded = getBanners().filter((b) => b.active);
    return loaded.length > 0 ? loaded : INITIAL_BANNERS;
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const loaded = getProducts();
    return loaded.length > 0 ? loaded : INITIAL_PRODUCTS;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const loaded = getCategories();
    return loaded.length > 0 ? loaded : INITIAL_CATEGORIES;
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  const loadData = () => {
    setBanners(getBanners().filter((b) => b.active));
    setProducts(getProducts());
    setCategories(getCategories());
  };

  useEffect(() => {
    loadData();
    const unsubBanners = subscribeToDb('banners', loadData);
    const unsubProducts = subscribeToDb('products', loadData);
    const unsubCategories = subscribeToDb('categories', loadData);

    return () => {
      unsubBanners();
      unsubProducts();
      unsubCategories();
    };
  }, []);

  // Slide timer
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const newestProducts = [...products]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  const departments = [
    {
      title: 'ZOHAN E-SECURITY',
      tagline: 'Smart Defense & Surveillance',
      desc: '4K IP CCTV cameras, walkthrough security gates, biometric time attendance, and certified fire suppression systems.',
      icon: ShieldCheck,
      color: 'from-red-600 to-rose-700',
      href: '/departments/#security',
      brands: 'Hikvision • Dahua • ZKTeco',
    },
    {
      title: 'ZOHAN NETWORKS',
      tagline: 'Enterprise Connectivity',
      desc: 'Long-range airMAX wireless backhaul bridges, optical fiber solutions, gigabit PoE switches, and rack server cabling.',
      icon: Cpu,
      color: 'from-blue-600 to-indigo-700',
      href: '/departments/#networks',
      brands: 'Ubiquiti • D-Link • Fast Cables',
    },
    {
      title: 'ZOHAN STATIONARY',
      tagline: 'Complete Corporate Supplies',
      desc: 'Box packaging copier papers, legal folders, desk organization units, archival ledgers, and heavy-duty consumables.',
      icon: FileText,
      color: 'from-amber-600 to-yellow-700',
      href: '/departments/#stationary',
      brands: 'Double A • Deli • PaperOne',
    },
    {
      title: 'ZOHAN CONSTRUCTIONS',
      tagline: 'Building Materials & Interiors',
      desc: 'Authentic Multani kiln-fired bricks, heavy interlocking tuff tiles, luxury sanitaryware, and Interwood office furniture.',
      icon: Building,
      color: 'from-slate-700 to-slate-900',
      href: '/departments/#constructions',
      brands: 'Interwood • Master • Amreli Steels',
    },
  ];

  return (
    <div className="space-y-14 pb-16">
      {/* 1. Hero Carousel Slider */}
      <section className="relative w-full bg-slate-950 text-white overflow-hidden min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-center">
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with balanced contrast overlay */}
            <div className="absolute inset-0">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                priority={idx === 0}
                className="object-cover object-center transform scale-105 transition-transform duration-10000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/20 sm:bg-gradient-to-r sm:from-slate-950/95 sm:via-slate-950/70 sm:to-slate-950/20" />
            </div>

            {/* Slide Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-center py-12 sm:py-16">
              <div className="max-w-2xl space-y-3 sm:space-y-4">
                {banner.badge && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-zohan-red text-white shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    {banner.badge}
                  </span>
                )}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  {banner.title}
                </h1>
                <p className="text-xs sm:text-base lg:text-lg text-zohan-gold font-semibold">
                  {banner.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-none">
                  {banner.description}
                </p>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2 sm:pt-4">
                  <Link
                    href={banner.ctaLink}
                    className="inline-flex items-center gap-2 bg-zohan-red hover:bg-zohan-red-dark text-white font-bold text-xs sm:text-sm px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg shadow-lg hover:shadow-red-600/30 transition-all"
                  >
                    <span>{banner.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {banner.secondaryCtaLink && (
                    <Link
                      href={banner.secondaryCtaLink}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg backdrop-blur-sm border border-white/20 transition-all"
                    >
                      <span>{banner.secondaryCtaText || 'Learn More'}</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all backdrop-blur-sm border border-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all backdrop-blur-sm border border-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-1.5 rounded-full transition-all ${
                    i === currentSlide ? 'bg-zohan-red w-8' : 'bg-white/40'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 2. Key Trust Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-3.5 sm:p-6 bg-white rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-50 flex items-center justify-center text-zohan-red flex-shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">12-Mo Warranty</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Official replacement cover</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
              <Wrench className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">5-Yr Spare Parts</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Maintenance support</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">24-Hr Response</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Emergency dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Award className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Gov & Bank Cert</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">NTN & STRN registered</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 5 Main Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zohan-red">
              Product Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Explore Our Comprehensive Inventory
            </h2>
          </div>
          <Link
            href="/shop/"
            className="text-xs sm:text-sm font-bold text-zohan-red hover:underline flex items-center gap-1"
          >
            <span>Browse All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}/`}
              className="group relative flex flex-col rounded-xl overflow-hidden bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-28 sm:h-44 w-full overflow-hidden bg-slate-100">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 text-white">
                  <h3 className="text-xs sm:text-sm font-bold leading-tight group-hover:text-zohan-gold transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] sm:text-[11px] text-slate-300">
                    {cat.subcategories.length} Sub-Categories
                  </span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-white flex-1 flex flex-col justify-between">
                <p className="hidden sm:block text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="pt-1 sm:pt-2 text-[11px] sm:text-xs font-semibold text-zohan-red flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Products</span> &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. 4 Core Departments Grid */}
      <section className="bg-slate-100/70 py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-zohan-red">
              Specialized Divisions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              The 4 Pillars of ZOHAN TRADERS
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Dedicated technical units staffed by qualified engineers and domain specialists to meet institutional procurement standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, i) => {
              const IconComp = dept.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dept.color} text-white flex items-center justify-center mb-4 shadow-md`}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-zohan-gold uppercase tracking-wider">
                      {dept.tagline}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 mb-2">
                      {dept.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {dept.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[11px] text-slate-400 font-medium mb-3">
                      Authorized: {dept.brands}
                    </p>
                    <Link
                      href={dept.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-zohan-red hover:text-zohan-red-dark group"
                    >
                      <span>Explore Department</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zohan-red">
                Handpicked by Specialists
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Featured Commercial Equipment
              </h2>
            </div>
            <Link
              href="/shop/"
              className="text-xs sm:text-sm font-bold text-zohan-red hover:underline flex items-center gap-1"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Newest Products Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zohan-red">
              Fresh Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Newest Arrivals in Store
            </h2>
          </div>
          <Link
            href="/shop/"
            className="text-xs sm:text-sm font-bold text-zohan-red hover:underline flex items-center gap-1"
          >
            <span>Browse All {products.length} Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {newestProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 7. Corporate Clients Showcase */}
      <section className="bg-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-zohan-gold">
              Trusted By Institutions Since 2017
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Our Corporate & Government Clients
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              We proudly supply leading banking networks, healthcare facilities, telecom operators, and industrial plants across DG Khan and Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CORPORATE_CLIENTS.map((client, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-4 text-center transition-all hover:border-zohan-gold flex flex-col justify-center items-center"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-100 mb-1">
                  {client.name}
                </span>
                <span className="text-[10px] text-zohan-gold/90 font-medium">
                  {client.category}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/clients/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zohan-gold hover:underline"
            >
              <span>View Complete Client Portfolio & Project Case Studies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Brand Partners Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-zohan-red">
            Official Alliances
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Authorized Brand Partners
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {BRAND_PARTNERS.map((brand, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-sm font-black tracking-wider text-slate-800 uppercase mb-1">
                {brand.logoText}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {brand.role}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Direct Call-to-Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-zohan-dark via-slate-900 to-red-950 text-white p-6 sm:p-12 shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zohan-gold">
              Procurement & Bulk Bids
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black">
              Need a Customized Corporate Quotation?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our DG Khan commercial desk handles institutional tender inquiries, quantity discounts, and site surveys for security and networking installations.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/contact/"
                className="bg-zohan-red hover:bg-zohan-red-dark text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-lg shadow-md transition-colors"
              >
                Request Quotation
              </Link>
              <a
                href="https://wa.me/923338586852?text=Hello%20Zohan%20Traders,%20I%20need%20a%20commercial%20quote."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-lg backdrop-blur-sm border border-white/20 transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Instant WhatsApp Inquiry</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
