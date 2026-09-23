'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Lock,
  Eye,
  EyeOff,
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  Ticket,
  LogOut,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Upload,
  Printer,
  X,
  Search,
  ChevronRight,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import {
  Product,
  Category,
  Order,
  HeroBanner,
  Coupon,
  StoreSettings,
  OrderStatus,
  PaymentMethod,
} from '@/lib/types';
import {
  getProducts,
  saveProduct,
  deleteProduct,
  getCategories,
  saveCategory,
  deleteCategory,
  getOrders,
  saveOrder,
  updateOrderStatus,
  getBanners,
  saveBanner,
  deleteBanner,
  getCoupons,
  saveCoupon,
  deleteCoupon,
  getStoreSettings,
  saveStoreSettings,
  resetToDefaults,
  subscribeToDb,
} from '@/lib/db';
import { formatPKR } from '@/lib/hash-utils';
import { compressImageToWebP } from '@/lib/image-compressor';

const MASTER_PIN = 'admin123';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'orders' | 'banners' | 'coupons' | 'settings'
  >('overview');

  // Database Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(getStoreSettings());

  // Search & Filter in Admin
  const [productSearch, setProductSearch] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newSubcatName, setNewSubcatName] = useState('');

  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [notification, setNotification] = useState<string>('');

  // Form Temp States for Product
  const [prodForm, setProdForm] = useState<{
    id?: string;
    name: string;
    slug: string;
    categoryId: string;
    subcategoryId?: string;
    price: number;
    salePrice?: number;
    stock: number;
    images: string[];
    description: string;
    features: string;
    specifications: string;
    brand: string;
    department?: Product['department'];
    isFeatured: boolean;
    isNew: boolean;
  }>({
    name: '',
    slug: '',
    categoryId: '',
    price: 0,
    stock: 10,
    images: [],
    description: '',
    features: '',
    specifications: '',
    brand: '',
    isFeatured: false,
    isNew: true,
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Auth persistence check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('zohan_admin_auth');
      if (stored === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === MASTER_PIN) {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('zohan_admin_auth', 'true');
      }
      setPinError('');
    } else {
      setPinError('Invalid master PIN. Please check and try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('zohan_admin_auth');
    }
  };

  // Load Data
  const refreshAll = () => {
    setProducts(getProducts());
    setCategories(getCategories());
    setOrders(getOrders());
    setBanners(getBanners());
    setCoupons(getCoupons());
    setSettings(getStoreSettings());
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshAll();
      const unsub = subscribeToDb('all', refreshAll);
      return unsub;
    }
  }, [isAuthenticated]);

  // Product Image Upload & WebP Compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      try {
        const compressed = await compressImageToWebP(files[i], 1200, 1200, 0.8);
        setProdForm((prev) => ({
          ...prev,
          images: [...prev.images, compressed.dataUrl],
        }));
        showToast(`Image converted to WebP (${compressed.sizeKb} KB)`);
      } catch (err) {
        console.error('Compression error:', err);
      }
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    const defaultCat = categories[0];
    setProdForm({
      name: '',
      slug: '',
      categoryId: defaultCat?.id || 'cat-security',
      subcategoryId: defaultCat?.subcategories[0]?.id || undefined,
      price: 0,
      stock: 10,
      images: [],
      description: '',
      features: 'High durability construction\nManufacturer certified\n12-Month replacement warranty',
      specifications: 'Warranty: 12 Months\nStandard: ISO Certified',
      brand: 'Hikvision',
      isFeatured: false,
      isNew: true,
      department: 'ZOHAN E-SECURITY',
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    const specsStr = Object.entries(p.specifications || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    setProdForm({
      id: p.id,
      name: p.name,
      slug: p.slug,
      categoryId: p.categoryId,
      subcategoryId: p.subcategoryId,
      price: p.price,
      salePrice: p.salePrice,
      stock: p.stock,
      images: p.images || [],
      description: p.description,
      features: (p.features || []).join('\n'),
      specifications: specsStr,
      brand: p.brand || '',
      department: p.department,
      isFeatured: !!p.isFeatured,
      isNew: !!p.isNew,
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name.trim()) return;

    // Parse features and specs
    const featuresArr = prodForm.features
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const specsObj: Record<string, string> = {};
    prodForm.specifications.split('\n').forEach((line) => {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const k = line.substring(0, idx).trim();
        const v = line.substring(idx + 1).trim();
        if (k && v) specsObj[k] = v;
      }
    });

    const slug =
      prodForm.slug.trim() ||
      prodForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const pToSave: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name: prodForm.name.trim(),
      slug,
      categoryId: prodForm.categoryId,
      subcategoryId: prodForm.subcategoryId || undefined,
      price: Number(prodForm.price),
      salePrice: prodForm.salePrice ? Number(prodForm.salePrice) : undefined,
      stock: Number(prodForm.stock),
      images:
        prodForm.images.length > 0
          ? prodForm.images
          : [
              'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=800&auto=format&fit=crop',
            ],
      description: prodForm.description,
      features: featuresArr,
      specifications: specsObj,
      brand: prodForm.brand || undefined,
      department: prodForm.department,
      isFeatured: prodForm.isFeatured,
      isNew: prodForm.isNew,
      created_at: editingProduct?.created_at || new Date().toISOString(),
    };

    saveProduct(pToSave);
    setProductModalOpen(false);
    refreshAll();
    showToast('Product saved successfully.');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      refreshAll();
      showToast('Product deleted.');
    }
  };

  // Category Save
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name.trim()) return;

    const slug =
      editingCategory.slug.trim() ||
      editingCategory.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const catToSave: Category = {
      id: editingCategory.id || `cat-${Date.now()}`,
      name: editingCategory.name.trim(),
      slug,
      description: editingCategory.description || '',
      image:
        editingCategory.image ||
        'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=1000&auto=format&fit=crop',
      subcategories: editingCategory.subcategories || [],
    };

    saveCategory(catToSave);
    setCategoryModalOpen(false);
    refreshAll();
    showToast('Category saved.');
  };

  const handleAddSubcategory = () => {
    if (!newSubcatName.trim() || !editingCategory) return;
    const cleanName = newSubcatName.trim();
    const newSub = {
      id: `sub-${Date.now()}`,
      categoryId: editingCategory.id || 'cat-new',
      name: cleanName,
      slug: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    };
    setEditingCategory({
      ...editingCategory,
      subcategories: [...(editingCategory.subcategories || []), newSub],
    });
    setNewSubcatName('');
  };

  const handleRemoveSubcategory = (subId: string) => {
    if (!editingCategory) return;
    setEditingCategory({
      ...editingCategory,
      subcategories: (editingCategory.subcategories || []).filter((s) => s.id !== subId),
    });
  };

  // Banner Save
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner?.title.trim()) return;

    const bannerToSave: HeroBanner = {
      id: editingBanner.id || `banner-${Date.now()}`,
      title: editingBanner.title,
      subtitle: editingBanner.subtitle || '',
      description: editingBanner.description || '',
      badge: editingBanner.badge || '',
      ctaText: editingBanner.ctaText || 'Explore Now',
      ctaLink: editingBanner.ctaLink || '/shop',
      secondaryCtaText: editingBanner.secondaryCtaText || '',
      secondaryCtaLink: editingBanner.secondaryCtaLink || '',
      imageUrl:
        editingBanner.imageUrl ||
        'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=1600&auto=format&fit=crop',
      active: editingBanner.active ?? true,
      displayOrder: editingBanner.displayOrder || 1,
    };

    saveBanner(bannerToSave);
    setBannerModalOpen(false);
    refreshAll();
    showToast('Hero banner saved.');
  };

  // Coupon Save
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon?.code.trim()) return;

    const couponToSave: Coupon = {
      id: editingCoupon.id || `coupon-${Date.now()}`,
      code: editingCoupon.code.toUpperCase().trim(),
      type: editingCoupon.type || 'percentage',
      value: Number(editingCoupon.value) || 10,
      minSpend: Number(editingCoupon.minSpend) || 0,
      active: editingCoupon.active ?? true,
      expiryDate: editingCoupon.expiryDate || '2027-12-31',
    };

    saveCoupon(couponToSave);
    setCouponModalOpen(false);
    refreshAll();
    showToast('Coupon code saved.');
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoreSettings(settings);
    showToast('Store & Financial Settings updated!');
  };

  // Order Status Change
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    refreshAll();
    if (viewOrder && viewOrder.id === orderId) {
      setViewOrder({ ...viewOrder, status: newStatus });
    }
    showToast(`Order status updated to ${newStatus}`);
  };

  // Calculations for Overview Tab
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const activeCouponsCount = coupons.filter((c) => c.active).length;

  // Unauthenticated PIN screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="relative w-14 h-14 mx-auto rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
              <Image src="/logo.jpg" alt="Zohan Logo" fill className="object-contain p-1" />
            </div>
            <h2 className="text-xl font-black text-white">Staff Admin Portal</h2>
            <p className="text-xs text-slate-400">
              Enter your master authorization PIN to access inventory, orders, and store financials.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Master Security PIN
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  placeholder="Enter PIN (admin123)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full text-base sm:text-sm pl-4 pr-11 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-zohan-red"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  aria-label="Toggle PIN visibility"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pinError && <p className="text-xs text-rose-500 mt-1.5">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-zohan-red hover:bg-zohan-red-dark text-white font-bold py-3 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-zohan-gold flex items-center justify-center gap-1"
            >
              <span>&larr; Return to Public Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered lists
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    if (orderFilterStatus === 'all') return true;
    return o.status === orderFilterStatus;
  });

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-900 text-slate-100 pb-20 md:pb-0">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-950 border-r border-slate-800 p-5 justify-between">
        <div className="space-y-6">
          {/* Logo & Badge */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 flex-shrink-0">
              <Image src="/logo.jpg" alt="Zohan" fill className="object-contain p-0.5" />
            </div>
            <div>
              <div className="font-black text-white text-sm">ZOHAN TRADERS</div>
              <div className="text-[10px] text-zohan-gold font-semibold uppercase">
                Admin Control Room
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'overview'
                  ? 'bg-zohan-red text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'products'
                  ? 'bg-zohan-red text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'categories'
                  ? 'bg-zohan-red text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'orders'
                  ? 'bg-zohan-red text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
              {pendingOrders > 0 && (
                <span className="ml-auto bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px]">
                  {pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'banners'
                  ? 'bg-zohan-red text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Hero Banners ({banners.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'coupons'
                  ? 'bg-zohan-red text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Coupons & Vouchers</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'settings'
                  ? 'bg-zohan-red text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Store Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 pt-6 border-t border-slate-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Storefront</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Staff Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white capitalize">
              {activeTab === 'overview' ? 'Operational Overview' : `${activeTab} Management`}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              NTN: {settings.ntn} • DG Khan Head Office • Real-time reactive data sync
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>

            <button
              onClick={handleLogout}
              className="md:hidden inline-flex items-center gap-1.5 bg-rose-950/80 text-rose-300 text-xs font-semibold px-3 py-2 rounded-lg"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-semibold">Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {formatPKR(totalRevenue)}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Based on live orders
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-semibold">Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-zohan-gold" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {orders.length}
                </div>
                <div className="text-[11px] text-amber-400 font-medium">
                  {pendingOrders} Pending Fulfillment
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-semibold">Active Products</span>
                  <Package className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {products.length}
                </div>
                <div className="text-[11px] text-slate-400">
                  Across 5 categories
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-semibold">Coupons Active</span>
                  <Ticket className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {activeCouponsCount}
                </div>
                <div className="text-[11px] text-slate-400">
                  {coupons.length} Total configured
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base text-white">Recent Sales & Inquiries</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-zohan-red hover:underline font-semibold"
                >
                  View All Orders &rarr;
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No orders placed yet. Place an order on the checkout page to test real-time recording.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2.5">Order Ref</th>
                        <th className="py-2.5">Customer</th>
                        <th className="py-2.5">Payment</th>
                        <th className="py-2.5">Total</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-slate-900/50">
                          <td className="py-3 font-mono font-bold text-white">{o.orderNumber}</td>
                          <td className="py-3">
                            <div className="font-semibold text-slate-200">{o.customerName}</div>
                            <div className="text-[10px] text-slate-500">{o.city}</div>
                          </td>
                          <td className="py-3 uppercase text-[10px] text-slate-400">
                            {o.paymentMethod}
                          </td>
                          <td className="py-3 font-bold text-white">{formatPKR(o.total)}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                o.status === 'Delivered'
                                  ? 'bg-emerald-950 text-emerald-300'
                                  : o.status === 'Cancelled'
                                  ? 'bg-rose-950 text-rose-300'
                                  : 'bg-amber-950 text-amber-300'
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setViewOrder(o)}
                              className="text-xs text-zohan-gold hover:underline font-semibold"
                            >
                              View / Print
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-zohan-red"
                />
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center gap-1.5 bg-zohan-red hover:bg-zohan-red-dark text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Mobile Cards View (< 768px) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                      <Image
                        src={p.images?.[0] || '/logo.jpg'}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Brand: {p.brand || 'N/A'} • Stock: {p.stock}
                      </div>
                      <div className="text-xs font-bold text-zohan-gold mt-1">
                        {formatPKR(p.salePrice ?? p.price)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-850 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-mono">ID: {p.id}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 text-rose-400 hover:text-rose-300 bg-slate-800 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= 768px) */}
            <div className="hidden md:block bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price / Sale</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
                            <Image
                              src={p.images?.[0] || '/logo.jpg'}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-white max-w-xs truncate">{p.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              Brand: {p.brand || 'Generic'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{p.categoryId}</td>
                      <td className="py-3 px-4 font-bold text-white">
                        {formatPKR(p.salePrice ?? p.price)}
                        {p.salePrice && (
                          <span className="text-[10px] text-slate-500 line-through block">
                            {formatPKR(p.price)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            p.stock > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {p.isFeatured ? (
                          <span className="text-amber-400 font-bold">Yes</span>
                        ) : (
                          <span className="text-slate-600">No</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">
                Manage high-level categories and nested sub-categories.
              </p>
              <button
                onClick={() => {
                  setEditingCategory({
                    id: '',
                    name: '',
                    slug: '',
                    description: '',
                    image: '',
                    subcategories: [],
                  });
                  setCategoryModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-zohan-red hover:bg-zohan-red-dark text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-800">
                      <Image src={c.image} alt={c.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-xs font-bold text-white">
                        {c.name}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>

                    <div>
                      <span className="text-[11px] font-bold text-slate-300 block mb-1">
                        Sub-categories ({c.subcategories.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {c.subcategories.map((s) => (
                          <span
                            key={s.id}
                            className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-850 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-mono">Slug: {c.slug}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(c);
                          setCategoryModalOpen(true);
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete category ${c.name}?`)) {
                            deleteCategory(c.id);
                            refreshAll();
                            showToast('Category deleted.');
                          }
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ORDERS & INVOICE TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Filter Status:</span>
                <select
                  value={orderFilterStatus}
                  onChange={(e) => setOrderFilterStatus(e.target.value)}
                  className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:ring-1 focus:ring-zohan-red"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="text-xs text-slate-400">
                Click any order to view detailed items and print institutional tax invoice.
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-12 text-center text-slate-500 text-xs">
                No orders matching filter &ldquo;{orderFilterStatus}&rdquo;.
              </div>
            ) : (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 font-mono font-bold text-white">{o.orderNumber}</td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(o.created_at).toLocaleDateString('en-PK')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{o.customerName}</div>
                          <div className="text-[10px] text-slate-500">{o.customerPhone}</div>
                        </td>
                        <td className="py-3 px-4 uppercase text-[10px] font-mono text-slate-300">
                          {o.paymentMethod}
                        </td>
                        <td className="py-3 px-4 font-bold text-white">{formatPKR(o.total)}</td>
                        <td className="py-3 px-4">
                          <select
                            value={o.status}
                            onChange={(e) =>
                              handleStatusChange(o.id, e.target.value as OrderStatus)
                            }
                            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] font-bold text-slate-200 focus:outline-none focus:ring-1 focus:ring-zohan-red"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setViewOrder(o)}
                            className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-zohan-gold font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 5. BANNERS TAB */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">
                Manage hero carousel slides and call-to-action destinations on the homepage.
              </p>
              <button
                onClick={() => {
                  setEditingBanner({
                    id: '',
                    title: '',
                    subtitle: '',
                    description: '',
                    badge: '',
                    ctaText: 'Explore Catalog',
                    ctaLink: '/shop',
                    secondaryCtaText: 'Contact Us',
                    secondaryCtaLink: '/contact',
                    imageUrl: '',
                    active: true,
                    displayOrder: banners.length + 1,
                  });
                  setBannerModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-zohan-red hover:bg-zohan-red-dark text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Banner Slide</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-800">
                      <Image src={b.imageUrl} alt={b.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-slate-950/60" />
                      <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                        <span className="text-[10px] text-zohan-gold font-bold">{b.badge}</span>
                        <h4 className="text-sm font-bold leading-tight">{b.title}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 font-semibold">{b.subtitle}</p>
                    <p className="text-xs text-slate-400 line-clamp-2">{b.description}</p>
                    <div className="text-[11px] text-slate-500">
                      CTA: <strong>{b.ctaText}</strong> &rarr; {b.ctaLink}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-850 flex justify-between items-center text-xs">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.active ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {b.active ? 'Active' : 'Hidden'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingBanner(b);
                          setBannerModalOpen(true);
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this banner?')) {
                            deleteBanner(b.id);
                            refreshAll();
                            showToast('Banner removed.');
                          }
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. COUPONS TAB */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">
                Manage promotional discount codes and spend thresholds.
              </p>
              <button
                onClick={() => {
                  setEditingCoupon({
                    id: '',
                    code: '',
                    type: 'percentage',
                    value: 10,
                    minSpend: 2000,
                    active: true,
                    expiryDate: '2027-12-31',
                  });
                  setCouponModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-zohan-red hover:bg-zohan-red-dark text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-base font-black text-zohan-gold bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                        {c.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          c.active ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {c.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-white pt-1">
                      {c.type === 'percentage' ? `${c.value}% OFF` : `Rs. ${c.value} FLAT OFF`}
                    </div>

                    <p className="text-xs text-slate-400">
                      Minimum order spend: <strong>{formatPKR(c.minSpend)}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500">Expires: {c.expiryDate}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-850 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingCoupon(c);
                        setCouponModalOpen(true);
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete coupon ${c.code}?`)) {
                          deleteCoupon(c.id);
                          refreshAll();
                          showToast('Coupon deleted.');
                        }
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            {/* Store Information */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2">
                Business & Tax Identity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Company Name</label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Official Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">NTN Number</label>
                  <input
                    type="text"
                    value={settings.ntn}
                    onChange={(e) => setSettings({ ...settings, ntn: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">STRN Number</label>
                  <input
                    type="text"
                    value={settings.strn}
                    onChange={(e) => setSettings({ ...settings, strn: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Phone Helpline</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Official Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Headquarters Address</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>

            {/* Shipping & Delivery Rules */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2">
                Shipping & Threshold Rules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Base Delivery Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={settings.baseShippingFee}
                    onChange={(e) =>
                      setSettings({ ...settings, baseShippingFee: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Free Delivery Threshold (PKR)
                  </label>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) =>
                      setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.codEnabled}
                      onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                      className="rounded text-zohan-red"
                    />
                    <span className="font-semibold text-slate-200">Enable Cash on Delivery</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Bank & Mobile Wallets */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2">
                Settlement & Payment Accounts
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 p-3 bg-slate-900 rounded-xl">
                  <strong className="text-zohan-gold block">JazzCash Details:</strong>
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={settings.jazzCash.accountNumber}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        jazzCash: { ...settings.jazzCash, accountNumber: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white"
                  />
                  <input
                    type="text"
                    placeholder="Account Title"
                    value={settings.jazzCash.accountTitle}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        jazzCash: { ...settings.jazzCash, accountTitle: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white"
                  />
                </div>

                <div className="space-y-2 p-3 bg-slate-900 rounded-xl">
                  <strong className="text-emerald-400 block">EasyPaisa Details:</strong>
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={settings.easyPaisa.accountNumber}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        easyPaisa: { ...settings.easyPaisa, accountNumber: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white"
                  />
                  <input
                    type="text"
                    placeholder="Account Title"
                    value={settings.easyPaisa.accountTitle}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        easyPaisa: { ...settings.easyPaisa, accountTitle: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white"
                  />
                </div>
              </div>

              {/* Bank details */}
              <div className="p-3 bg-slate-900 rounded-xl space-y-2 text-xs">
                <strong className="text-blue-400 block">Corporate Bank Wire Details:</strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Bank Name"
                    value={settings.bankTransfer.bankName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bankTransfer: { ...settings.bankTransfer, bankName: e.target.value },
                      })
                    }
                    className="p-2 bg-slate-950 border border-slate-800 rounded text-white"
                  />
                  <input
                    type="text"
                    placeholder="Account Title"
                    value={settings.bankTransfer.accountTitle}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bankTransfer: { ...settings.bankTransfer, accountTitle: e.target.value },
                      })
                    }
                    className="p-2 bg-slate-950 border border-slate-800 rounded text-white"
                  />
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={settings.bankTransfer.accountNumber}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bankTransfer: { ...settings.bankTransfer, accountNumber: e.target.value },
                      })
                    }
                    className="p-2 bg-slate-950 border border-slate-800 rounded text-white"
                  />
                  <input
                    type="text"
                    placeholder="IBAN (e.g. PK36MEZN...)"
                    value={settings.bankTransfer.iban}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bankTransfer: { ...settings.bankTransfer, iban: e.target.value },
                      })
                    }
                    className="p-2 bg-slate-950 border border-slate-800 rounded text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                className="bg-zohan-red hover:bg-zohan-red-dark text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-colors"
              >
                Save All Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset all catalog, products, and banners to original seed data?')) {
                    resetToDefaults();
                    refreshAll();
                    showToast('Data reset to defaults.');
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900 px-3 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Database to Defaults</span>
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950 border-t border-slate-800 flex justify-around items-center p-2 text-[10px]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center gap-1 p-2 touch-target-min ${
            activeTab === 'overview' ? 'text-zohan-red font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex flex-col items-center gap-1 p-2 touch-target-min ${
            activeTab === 'products' ? 'text-zohan-red font-bold' : 'text-slate-400'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>Items</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-1 p-2 touch-target-min relative ${
            activeTab === 'orders' ? 'text-zohan-red font-bold' : 'text-slate-400'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Orders</span>
          {pendingOrders > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex flex-col items-center gap-1 p-2 touch-target-min ${
            activeTab === 'categories' ? 'text-zohan-red font-bold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Cats</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 p-2 touch-target-min ${
            activeTab === 'settings' ? 'text-zohan-red font-bold' : 'text-slate-400'
          }`}
        >
          <Sliders className="w-5 h-5" />
          <span>Config</span>
        </button>
      </nav>

      {/* --- MODALS --- */}

      {/* 1. PRODUCT ADD / EDIT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hikvision 4K IP Camera"
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Slug (Auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. hikvision-4k-ip-camera"
                    value={prodForm.slug}
                    onChange={(e) => setProdForm({ ...prodForm, slug: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Category *</label>
                  <select
                    value={prodForm.categoryId}
                    onChange={(e) => {
                      const newCatId = e.target.value;
                      const catObj = categories.find((c) => c.id === newCatId);
                      setProdForm({
                        ...prodForm,
                        categoryId: newCatId,
                        subcategoryId: catObj?.subcategories[0]?.id || undefined,
                      });
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Subcategory</label>
                  <select
                    value={prodForm.subcategoryId || ''}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, subcategoryId: e.target.value || undefined })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="">None / General</option>
                    {categories
                      .find((c) => c.id === prodForm.categoryId)
                      ?.subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Regular Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Sale Price (Optional)</label>
                  <input
                    type="number"
                    value={prodForm.salePrice || ''}
                    onChange={(e) =>
                      setProdForm({
                        ...prodForm,
                        salePrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Hikvision, Ubiquiti"
                    value={prodForm.brand}
                    onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Department</label>
                  <select
                    value={prodForm.department || ''}
                    onChange={(e) =>
                      setProdForm({
                        ...prodForm,
                        department: (e.target.value as Product['department']) || undefined,
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="">None</option>
                    <option value="ZOHAN E-SECURITY">ZOHAN E-SECURITY</option>
                    <option value="ZOHAN NETWORKS">ZOHAN NETWORKS</option>
                    <option value="ZOHAN CONSTRUCTIONS">ZOHAN CONSTRUCTIONS</option>
                    <option value="ZOHAN STATIONARY">ZOHAN STATIONARY</option>
                  </select>
                </div>
              </div>

              {/* Multi-Image Upload with client WebP converter */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Product Images (Multi-upload with Auto-WebP Compression)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-lg border border-slate-700 transition-colors">
                    <Upload className="w-4 h-4 text-zohan-gold" />
                    <span>Upload Image File(s)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Auto-converts to lightweight WebP (&lt;80KB)
                  </span>
                </div>

                {prodForm.images.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {prodForm.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative w-16 h-16 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700"
                      >
                        <Image src={img} alt={`Preview ${i}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setProdForm({
                              ...prodForm,
                              images: prodForm.images.filter((_, idx) => idx !== i),
                            })
                          }
                          className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Features (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={prodForm.features}
                    onChange={(e) => setProdForm({ ...prodForm, features: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Specifications (Key: Value per line)
                  </label>
                  <textarea
                    rows={3}
                    value={prodForm.specifications}
                    onChange={(e) => setProdForm({ ...prodForm, specifications: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isFeatured}
                    onChange={(e) => setProdForm({ ...prodForm, isFeatured: e.target.checked })}
                    className="rounded text-zohan-red"
                  />
                  <span className="font-medium text-slate-300">Featured on Home</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isNew}
                    onChange={(e) => setProdForm({ ...prodForm, isNew: e.target.checked })}
                    className="rounded text-zohan-red"
                  />
                  <span className="font-medium text-slate-300">Mark as New Arrival</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-zohan-red hover:bg-zohan-red-dark text-white font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CATEGORY ADD / EDIT MODAL */}
      {categoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Edit Category</h3>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Slug</label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, slug: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingCategory.image}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, image: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.description}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Manage Sub-Categories ({editingCategory.subcategories?.length || 0})
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="New subcategory name..."
                    value={newSubcatName}
                    onChange={(e) => setNewSubcatName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubcategory();
                      }
                    }}
                    className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategory}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg font-semibold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-950/60 rounded-lg border border-slate-800">
                  {(editingCategory.subcategories || []).length === 0 ? (
                    <span className="text-[11px] text-slate-500 p-1">No subcategories added yet.</span>
                  ) : (
                    editingCategory.subcategories.map((sub) => (
                      <span
                        key={sub.id}
                        className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-md border border-slate-700"
                      >
                        <span>{sub.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategory(sub.id)}
                          className="text-slate-400 hover:text-rose-400"
                          title="Remove subcategory"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-zohan-red text-white font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. HERO BANNER ADD / EDIT MODAL */}
      {bannerModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Hero Carousel Slide</h3>
              <button
                onClick={() => setBannerModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Main Heading *</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingBanner.subtitle}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Badge Text</label>
                <input
                  type="text"
                  placeholder="e.g. 12-Month Replacement Warranty"
                  value={editingBanner.badge}
                  onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Background Image URL</label>
                <input
                  type="text"
                  value={editingBanner.imageUrl}
                  onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={editingBanner.ctaText}
                    onChange={(e) => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">CTA Destination Link</label>
                  <input
                    type="text"
                    value={editingBanner.ctaLink}
                    onChange={(e) => setEditingBanner({ ...editingBanner, ctaLink: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBannerModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-zohan-red text-white font-bold"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. COUPON ADD / EDIT MODAL */}
      {couponModalOpen && editingCoupon && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Coupon Settings</h3>
              <button
                onClick={() => setCouponModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP20"
                  value={editingCoupon.code}
                  onChange={(e) =>
                    setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })
                  }
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Discount Type</label>
                  <select
                    value={editingCoupon.type}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        type: e.target.value as 'percentage' | 'fixed',
                      })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={editingCoupon.value}
                    onChange={(e) =>
                      setEditingCoupon({ ...editingCoupon, value: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Minimum Order Spend (PKR)
                </label>
                <input
                  type="number"
                  value={editingCoupon.minSpend}
                  onChange={(e) =>
                    setEditingCoupon({ ...editingCoupon, minSpend: Number(e.target.value) })
                  }
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-zohan-red text-white font-bold"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. VIEW ORDER & PRINTABLE INVOICE MODAL */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 no-print">
              <h3 className="font-bold text-base text-white">
                Order #{viewOrder.orderNumber}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 bg-zohan-red text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Tax Invoice</span>
                </button>
                <button
                  onClick={() => setViewOrder(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Isolated Printable Area */}
            <div
              id="printable-invoice-area"
              className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-sm"
            >
              {/* Invoice Head */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    ZOHAN <span className="text-zohan-red">TRADERS</span>
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Security • IT & Networking • Construction Raw Materials
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Jampur Road, DG Khan • Helpline: {settings.phone}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    NTN: {settings.ntn} | STRN: {settings.strn}
                  </p>
                </div>

                <div className="text-right text-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-zohan-red">
                    COMMERCIAL TAX INVOICE
                  </div>
                  <div className="font-mono font-bold text-sm text-slate-900 mt-1">
                    Invoice #{viewOrder.orderNumber}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Date: {new Date(viewOrder.created_at).toLocaleDateString('en-PK')}
                  </div>
                  <div className="text-slate-500">
                    Status: <strong className="text-slate-900">{viewOrder.status}</strong>
                  </div>
                </div>
              </div>

              {/* Customer Box */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">
                    Billed To:
                  </span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {viewOrder.customerName}
                  </div>
                  <div className="text-slate-600">Phone: {viewOrder.customerPhone}</div>
                  <div className="text-slate-600">City: {viewOrder.city}</div>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">
                    Delivery Address:
                  </span>
                  <div className="text-slate-700 mt-0.5 leading-relaxed">
                    {viewOrder.deliveryAddress}
                  </div>
                  <div className="text-slate-500 mt-1">
                    Payment Method: <strong className="uppercase">{viewOrder.paymentMethod}</strong>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-600 bg-slate-50">
                    <th className="py-2 px-3">Item Description</th>
                    <th className="py-2 px-3 text-center">Unit Price</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {it.productName}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-600">
                        {formatPKR(it.price)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                        {it.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        {formatPKR(it.price * it.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Calculation */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatPKR(viewOrder.subtotal)}</span>
                  </div>
                  {viewOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount ({viewOrder.couponCode || 'Promo'}):</span>
                      <span className="font-semibold">-{formatPKR(viewOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold">
                      {viewOrder.shippingFee === 0 ? 'FREE' : formatPKR(viewOrder.shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-300">
                    <span>Total Amount:</span>
                    <span className="text-zohan-red text-base">{formatPKR(viewOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Footer Note on invoice */}
              <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 text-center space-y-0.5">
                <p>Official Computer-Generated Tax Invoice — ZOHAN TRADERS DG KHAN</p>
                <p>For warranty claims or corporate service calls, contact +92333-8586852.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
