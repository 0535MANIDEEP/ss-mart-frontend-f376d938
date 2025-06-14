
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
    const stored = localStorage.getItem(CART_KEY); // CHANGED TO localStorage
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Save cart to localStorage only
 */
const setCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (e) {
    // ignore
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
    setCartToStorage(items);
    set({ items });
  },
  removeFromCart: (id) => {
    const items = get().items.filter(item => item._id !== id);
    setCartToStorage(items);
    set({ items });
  },
  updateQuantity: (id, qty) => {
    const items = get().items.map(item =>
      item._id === id ? { ...item, quantity: qty } : item
    );
    setCartToStorage(items);
    set({ items });
  },
  clearCart: () => {
    localStorage.removeItem(CART_KEY);
    set({ items: [] });
  }
}));
