
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { immer } from "zustand/middleware/immer";
import { toast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

type WishlistItem = {
  id: string; // wishlist row UUID
  product_id: number;
  created_at: string;
};

interface WishlistState {
  loading: boolean;
  items: WishlistItem[];
  fetchWishlist: (user: User | null) => Promise<void>;
  addToWishlist: (user: User | null, product_id: number) => Promise<void>;
  removeFromWishlist: (user: User | null, product_id: number) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  immer((set, get) => ({
    loading: false,
    items: [],
    fetchWishlist: async (user) => {
      if (!user) {
        set({ items: [] });
        return;
      }
      set({ loading: true });
      const { data, error } = await supabase
        .from("wishlists")
        .select("id, product_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        set({ items: [] });
      } else {
        set({ items: data ?? [] });
      }
      set({ loading: false });
    },
    addToWishlist: async (user, product_id) => {
      if (!user) {
        toast({ title: "Login required", description: "Please login to use wishlist.", variant: "destructive" });
        return;
      }
      // Prevent double add
      const exists = get().items.some(w => w.product_id === product_id);
      if (exists) return;
      set({ loading: true });
      const { data, error } = await supabase
        .from("wishlists")
        .insert([{ user_id: user.id, product_id }])
        .select()
        .single();
      if (!error && data) {
        set(state => { state.items.unshift(data); });
        toast({ title: "Added to wishlist", description: "Product was added to your wishlist." });
      } else if (error) {
        toast({ title: "Wishlist error", description: error.message, variant: "destructive" });
      }
      set({ loading: false });
    },
    removeFromWishlist: async (user, product_id) => {
      if (!user) return;
      set({ loading: true });
      const item = get().items.find(w => w.product_id === product_id);
      if (!item) return;
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product_id);
      if (!error) {
        set(state => {
          state.items = state.items.filter(w => w.product_id !== product_id);
        });
        toast({ title: "Removed from wishlist", description: "Removed product from your wishlist." });
      } else {
        toast({ title: "Wishlist error", description: error.message, variant: "destructive" });
      }
      set({ loading: false });
    },
  }))
);

