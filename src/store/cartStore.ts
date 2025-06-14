
import { create } from "zustand";

const CART_KEY = "ssmart_cart";

// Product type as stored in cart
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: CartItem, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
}

const getCartFromStorage = (): CartItem[] => {
  try {
    const stored = sessionStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: getCartFromStorage(),
  addToCart: (product, quantity = 1) => {
    const items = [...get().items];
    const idx = items.findIndex(i => i._id === product._id);
    if (idx > -1) {
      items[idx].quantity += quantity;
    } else {
      items.push({ ...product, quantity });
    }
    sessionStorage.setItem(CART_KEY, JSON.stringify(items));
    set({ items });
  },
  removeFromCart: (id) => {
    const items = get().items.filter(item => item._id !== id);
    sessionStorage.setItem(CART_KEY, JSON.stringify(items));
    set({ items });
  },
  updateQuantity: (id, qty) => {
    const items = get().items.map(item =>
      item._id === id ? { ...item, quantity: qty } : item
    );
    sessionStorage.setItem(CART_KEY, JSON.stringify(items));
    set({ items });
  },
  clearCart: () => {
    sessionStorage.removeItem(CART_KEY);
    set({ items: [] });
  }
}));
