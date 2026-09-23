import {
  Category,
  Product,
  Order,
  HeroBanner,
  Coupon,
  StoreSettings,
  OrderStatus,
} from './types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
} from './seed-data';

const STORAGE_KEYS = {
  PRODUCTS: 'zohan_products_v3',
  CATEGORIES: 'zohan_categories_v2',
  ORDERS: 'zohan_orders_v2',
  BANNERS: 'zohan_banners_v3',
  COUPONS: 'zohan_coupons_v2',
  SETTINGS: 'zohan_settings_v2',
};

const DB_EVENT_NAME = 'zohan_db_update';

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function notifyChange(table: string) {
  if (!isClient()) return;
  window.dispatchEvent(new CustomEvent(DB_EVENT_NAME, { detail: { table } }));
}

export function subscribeToDb(table: string, callback: () => void): () => void {
  if (!isClient()) return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<{ table: string }>;
    if (customEvent.detail && (customEvent.detail.table === table || customEvent.detail.table === 'all')) {
      callback();
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key && Object.values(STORAGE_KEYS).includes(e.key)) {
      callback();
    }
  };

  window.addEventListener(DB_EVENT_NAME, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(DB_EVENT_NAME, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

// ---------------- PRODUCTS ----------------
export function getProducts(): Product[] {
  if (!isClient()) return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed: Product[] = JSON.parse(raw);
    return parsed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (err) {
    console.error('Error fetching products from storage:', err);
    return INITIAL_PRODUCTS;
  }
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find((p) => p.id === id || p.slug === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getProducts();
  return products.find((p) => p.slug === slug);
}

export function saveProduct(product: Product): Product {
  const products = getProducts();
  const existingIndex = products.findIndex((p) => p.id === product.id);
  let updatedList: Product[];

  const updatedProduct = {
    ...product,
    updated_at: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    updatedList = [...products];
    updatedList[existingIndex] = updatedProduct;
  } else {
    updatedProduct.created_at = updatedProduct.created_at || new Date().toISOString();
    updatedList = [updatedProduct, ...products];
  }

  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedList));
    notifyChange('products');
  }
  return updatedProduct;
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    notifyChange('products');
  }
  return true;
}

// ---------------- CATEGORIES ----------------
export function getCategories(): Category[] {
  if (!isClient()) return INITIAL_CATEGORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error fetching categories from storage:', err);
    return INITIAL_CATEGORIES;
  }
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const categories = getCategories();
  return categories.find((c) => c.slug === slug);
}

export function saveCategory(category: Category): Category {
  const categories = getCategories();
  const existingIndex = categories.findIndex((c) => c.id === category.id);
  let updatedList: Category[];

  if (existingIndex >= 0) {
    updatedList = [...categories];
    updatedList[existingIndex] = category;
  } else {
    updatedList = [...categories, category];
  }

  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updatedList));
    notifyChange('categories');
  }
  return category;
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
    notifyChange('categories');
  }
  return true;
}

// ---------------- ORDERS ----------------
export function getOrders(): Order[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) return [];
    const parsed: Order[] = JSON.parse(raw);
    return parsed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (err) {
    console.error('Error fetching orders from storage:', err);
    return [];
  }
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders();
  return orders.find((o) => o.id === id || o.orderNumber === id);
}

export function saveOrder(order: Order): Order {
  const orders = getOrders();
  const existingIndex = orders.findIndex((o) => o.id === order.id);
  let updatedList: Order[];

  if (existingIndex >= 0) {
    updatedList = [...orders];
    updatedList[existingIndex] = order;
  } else {
    updatedList = [order, ...orders];
  }

  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedList));
    notifyChange('orders');
  }
  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const orders = getOrders();
  const order = orders.find((o) => o.id === id || o.orderNumber === id);
  if (!order) return undefined;

  order.status = status;
  saveOrder(order);
  return order;
}

// ---------------- BANNERS ----------------
export function getBanners(): HeroBanner[] {
  if (!isClient()) return INITIAL_BANNERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BANNERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(INITIAL_BANNERS));
      return INITIAL_BANNERS;
    }
    const parsed: HeroBanner[] = JSON.parse(raw);
    return parsed.sort((a, b) => a.displayOrder - b.displayOrder);
  } catch (err) {
    console.error('Error fetching banners from storage:', err);
    return INITIAL_BANNERS;
  }
}

export function saveBanner(banner: HeroBanner): HeroBanner {
  const banners = getBanners();
  const existingIndex = banners.findIndex((b) => b.id === banner.id);
  let updatedList: HeroBanner[];

  if (existingIndex >= 0) {
    updatedList = [...banners];
    updatedList[existingIndex] = banner;
  } else {
    updatedList = [...banners, banner];
  }

  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(updatedList));
    notifyChange('banners');
  }
  return banner;
}

export function deleteBanner(id: string): boolean {
  const banners = getBanners();
  const filtered = banners.filter((b) => b.id !== id);
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(filtered));
    notifyChange('banners');
  }
  return true;
}

// ---------------- COUPONS ----------------
export function getCoupons(): Coupon[] {
  if (!isClient()) return INITIAL_COUPONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
      return INITIAL_COUPONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error fetching coupons from storage:', err);
    return INITIAL_COUPONS;
  }
}

export function getCouponByCode(code: string): Coupon | undefined {
  const coupons = getCoupons();
  return coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
}

export function saveCoupon(coupon: Coupon): Coupon {
  const coupons = getCoupons();
  const existingIndex = coupons.findIndex((c) => c.id === coupon.id);
  let updatedList: Coupon[];

  if (existingIndex >= 0) {
    updatedList = [...coupons];
    updatedList[existingIndex] = coupon;
  } else {
    updatedList = [...coupons, coupon];
  }

  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(updatedList));
    notifyChange('coupons');
  }
  return coupon;
}

export function deleteCoupon(id: string): boolean {
  const coupons = getCoupons();
  const filtered = coupons.filter((c) => c.id !== id);
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(filtered));
    notifyChange('coupons');
  }
  return true;
}

// ---------------- STORE SETTINGS ----------------
export function getStoreSettings(): StoreSettings {
  if (!isClient()) return INITIAL_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error fetching settings from storage:', err);
    return INITIAL_SETTINGS;
  }
}

export function saveStoreSettings(settings: StoreSettings): StoreSettings {
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    notifyChange('settings');
  }
  return settings;
}

export function resetToDefaults(): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(INITIAL_BANNERS));
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  notifyChange('all');
}
