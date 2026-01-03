
import { Product, Category, Order, Coupon, OrderStatus, CartItem } from './types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Classic Premium Black Casual',
    description: 'A minimal and clean look for everyday comfort. Made from genuine leather.',
    price: 1990,
    originalPrice: 2490,
    category: 'Casual Shoes',
    images: ['https://picsum.photos/seed/shoe1/600/600'],
    variations: ['39', '40', '41', '42', '43'],
    stock: 50,
    isVisible: true,
    isFeatured: true
  },
  {
    id: 'p2',
    name: 'Men\'s Genuine Leather Cycle Shoe',
    description: 'Perfect combination of cycle shoe design and premium leather durability.',
    price: 1430,
    originalPrice: 1790,
    category: 'Cycle Shoes',
    images: ['https://picsum.photos/seed/shoe2/600/600'],
    variations: ['40', '41', '42'],
    stock: 25,
    isVisible: true,
    isFeatured: true
  }
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'SACCHI', image: 'https://picsum.photos/seed/sacchi/400/400' },
  { id: 'c2', name: 'LOAFER', image: 'https://picsum.photos/seed/loafer/400/400' },
  { id: 'c3', name: 'FORMAL SHOES', image: 'https://picsum.photos/seed/formal/400/400' },
  { id: 'c4', name: 'CASUAL SHOES', image: 'https://picsum.photos/seed/casual/400/400' },
  { id: 'c5', name: 'CYCLE SHOES', image: 'https://picsum.photos/seed/cycle/400/400' },
  { id: 'c6', name: 'HALF LOAFER', image: 'https://picsum.photos/seed/half/400/400' },
  { id: 'c7', name: 'TARSAL', image: 'https://picsum.photos/seed/tarsal/400/400' },
  { id: 'c8', name: 'SANDAL', image: 'https://picsum.photos/seed/sandal/400/400' },
  { id: 'c9', name: 'BOOT', image: 'https://picsum.photos/seed/boot/400/400' },
  { id: 'c10', name: 'SHOE CARE ESSENTIALS', image: 'https://picsum.photos/seed/care/400/400' }
];

const STORAGE_KEYS = {
  PRODUCTS: 'shop_products',
  ORDERS: 'shop_orders',
  COUPONS: 'shop_coupons',
  CATEGORIES: 'shop_categories',
  CART: 'shop_cart',
  SETTINGS: 'shop_settings',
  AUTH: 'shop_admin_auth'
};

export const DB = {
  // Auth logic
  login: (email: string, pass: string): boolean => {
    // In a real app, this would be a server request
    if (email === 'admin@leathershop.com' && pass === 'admin123') {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ 
        user: 'Admin User', 
        token: 'mock-jwt-token-' + Date.now() 
      }));
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },
  isAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) !== null;
  },
  getAdminUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data).user : null;
  },

  getProducts: (): Product[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : INITIAL_PRODUCTS;
  },
  saveProducts: (products: Product[]) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },
  getCategories: (): Category[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : INITIAL_CATEGORIES;
  },
  saveCategories: (categories: Category[]) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },
  getOrders: (): Order[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  },
  saveOrder: (order: Order) => {
    const orders = DB.getOrders();
    orders.unshift(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    
    // Dispatch event for admin notification
    window.dispatchEvent(new CustomEvent('new-order-placed', { detail: order }));
    
    const products = DB.getProducts();
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) product.stock -= item.quantity;
    });
    DB.saveProducts(products);
  },
  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    const orders = DB.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
  },
  getCoupons: (): Coupon[] => {
    const data = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return data ? JSON.parse(data) : [];
  },
  saveCoupons: (coupons: Coupon[]) => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  },
  getSettings: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      storeName: 'LeatherShop',
      contactPhone: '+880 1709 306560',
      contactEmail: 'support@leathershop.com',
      shippingInner: 70,
      shippingOuter: 120,
    };
  },
  saveSettings: (settings: any) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },
  getCart: (): CartItem[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    return data ? JSON.parse(data) : [];
  },
  saveCart: (cart: CartItem[]) => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  },
  addToCart: (item: CartItem) => {
    const cart = DB.getCart();
    const existingIndex = cart.findIndex(i => i.id === item.id);
    if (existingIndex !== -1) cart[existingIndex].quantity += item.quantity;
    else cart.push(item);
    DB.saveCart(cart);
  },
  removeFromCart: (cartItemId: string) => {
    const cart = DB.getCart().filter(i => i.id !== cartItemId);
    DB.saveCart(cart);
  },
  updateCartQuantity: (cartItemId: string, quantity: number) => {
    const cart = DB.getCart();
    const index = cart.findIndex(i => i.id === cartItemId);
    if (index !== -1) {
      cart[index].quantity = Math.max(1, quantity);
      DB.saveCart(cart);
    }
  },
  clearCart: () => DB.saveCart([])
};
