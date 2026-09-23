export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  subcategories: SubCategory[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  subcategoryId?: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  features: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  department?: 'ZOHAN E-SECURITY' | 'ZOHAN NETWORKS' | 'ZOHAN STATIONARY' | 'ZOHAN CONSTRUCTIONS';
  brand?: string;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  selectedVariant?: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  city: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  couponCode?: string;
  created_at: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl: string;
  active: boolean;
  displayOrder: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
  active: boolean;
  expiryDate?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  ntn: string;
  strn: string;
  baseShippingFee: number;
  freeShippingThreshold: number;
  codEnabled: boolean;
  jazzCash: {
    accountTitle: string;
    accountNumber: string;
    instruction: string;
  };
  easyPaisa: {
    accountTitle: string;
    accountNumber: string;
    instruction: string;
  };
  bankTransfer: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    branch: string;
  };
  currency: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}
