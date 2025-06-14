
import { create } from "zustand";

const CART_KEY = "ssmart_cart";

/**
 * CartItem: product as stored in cart.
 */
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
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    // Validate minimal structure
    return parsed.filter(i => i && typeof i._id === "string");
  } catch {
    return [];
  }
};

/**
 * Save cart to localStorage only.
 */
const setCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {}
};

export const useCartStore = create<CartState>((set, get) => ({
  items: getCartFromStorage(),
  addToCart: (product, quantity = 1) => {
    let items = [...get().items];
    const idx = items.findIndex(i => i._id === product._id);
    if (idx > -1) {
      // Do not allow quantity to exceed stock
      items[idx].quantity = Math.min(
        items[idx].quantity + quantity,
        product.stock || 99
      );
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
    let items = get().items.map(item =>
      item._id === id ? { ...item, quantity: Math.max(1, Math.min(qty, item.stock || 99)) } : item
    );
    setCartToStorage(items);
    set({ items });
  },
  clearCart: () => {
    localStorage.removeItem(CART_KEY);
    set({ items: [] });
  }
}));
