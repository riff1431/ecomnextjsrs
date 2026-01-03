
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  variations: string[];
  stock: number;
  isVisible: boolean;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface OrderItem {
  productId: string;
  name: string;
  variation: string;
  quantity: number;
  price: number;
}

export interface CartItem extends OrderItem {
  id: string; // unique cart item id (productId + variation)
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  shippingFee: number;
  note?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}