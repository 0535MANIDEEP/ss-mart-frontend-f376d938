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
    const addQty = Math.max(1, quantity);

    if (idx > -1) {
      // Existing item: increment, but never exceed stock
      const existing = items[idx];
      const maxStock = product.stock || existing.stock || 99;
      const newQty = Math.min(existing.quantity + addQty, maxStock);
      items[idx] = { ...existing, quantity: newQty };
    } else {
      // New item: clamp quantity to stock
      const maxStock = product.stock || 99;
      const finalQty = Math.min(addQty, maxStock);
      items.push({ ...product, quantity: finalQty });
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
      item._id === id
        ? { ...item, quantity: Math.max(1, Math.min(qty, item.stock || 99)) }
        : item
    );
    setCartToStorage(items);
    set({ items });
  },

  clearCart: () => {
    localStorage.removeItem(CART_KEY);
    set({ items: [] });
  }
}));
