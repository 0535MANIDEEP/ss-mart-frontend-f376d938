
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import QuantitySelector from "./QuantitySelector";

interface ProductQuickViewProps {
  product: any;
  open: boolean;
  onClose: () => void;
}

// Reuse logic for multilingual fields
function getProductField(data: any, lang: string, fallback: string = ""): string {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  return data[lang] || data.en || fallback;
}

export default function ProductQuickView({ product, open, onClose }: ProductQuickViewProps) {
  const { t, i18n } = useTranslation();
  const addToCart = useCartStore(state => state.addToCart);
  const updateQty = useCartStore(state => state.updateQuantity);
  const items = useCartStore(state => state.items);
  const navigate = useNavigate();
  const cartItem = items.find(i => i._id === product.id?.toString());
  const stock = product.stock ?? 0;
  const [qty, setQty] = useState<number>(cartItem?.quantity || 1);

  useEffect(() => {
    if (open) setQty(cartItem?.quantity || 1);
  }, [open, cartItem?.quantity]);

  if (!open) return null;

  const lang = i18n.language || "en";
  const name = getProductField(product.name, lang, t("noDescription") || "No desc");
  const desc = getProductField(product.description, lang, t("noDescription") || "No desc");

  const handleAdd = () => {
    if (qty < 1) {
      toast({
        title: t("cannotAddZero"),
        description: t("Please increase quantity to add this product to cart."),
        variant: "destructive"
      });
      return;
    }
    if (cartItem) {
      updateQty(product.id?.toString(), qty);
    } else {
      addToCart({
        _id: product.id?.toString(),
        name,
        price: product.price,
        quantity: qty,
        stock: product.stock,
        image: product.image_url,
      }, qty);
    }
    toast({
      duration: 1350,
      title: t("addedToCart"),
      description: (
        <div className="flex items-center gap-2">
          <span className="animate-pulse">✅</span>
          <span className="font-semibold text-lux-gold">{t("addedToCart")}</span>
        </div>
      ),
      variant: "default"
    });
  };

  const handleBuyNow = () => {
    handleAdd();
    onClose();
    setTimeout(() => navigate("/checkout"), 200);
  };

  const handleInc = () => {
    if (qty < stock) setQty(qty + 1);
  };

  const handleDec = () => {
    if (qty > 1) setQty(qty - 1);
  };

  // Close on escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in"
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white dark:bg-lux-black rounded-lg shadow-lg max-w-xl w-full p-6 relative animate-scale-in">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
        >×</button>
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={product.image_url || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=700&q=80"}
            alt={name}
            className="w-full md:w-56 h-44 object-cover rounded"
            loading="lazy"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{name}</h2>
            <p className="mb-3 text-gray-600 dark:text-gray-300">{desc}</p>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl text-green-700 font-bold">₹{product.price}</span>
              <span className="text-xs px-2 py-1 bg-lux-gold/10 text-lux-gold border rounded-full">{product.category}</span>
              <span className="text-sm text-gray-500 ml-3">{t("stock", { count: product.stock })}</span>
            </div>
            {/* Qty controls */}
            <div className="flex items-center gap-3 my-1 mb-3">
              <QuantitySelector
                quantity={qty}
                stock={stock}
                onInc={handleInc}
                onDec={handleDec}
                disabled={stock <= 0}
              />
            </div>
            <div className="flex flex-col gap-2 mt-1">
              {/* Only show Add to Cart when qty ≥ 1 */}
              {qty >= 1 && (
                <Button
                  onClick={() => { handleAdd(); onClose(); }}
                  className={`bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 text-lg font-semibold shadow transition-opacity duration-300 ${qty === 1 ? "animate-fade-in" : ""}`}
                  aria-label={t("addToCart")}
                  tabIndex={0}
                  style={{ opacity: qty >= 1 ? 1 : 0.3, pointerEvents: qty >= 1 ? "auto" : "none" }}
                >
                  <ShoppingCart size={20} /> {t("addToCart")}
                </Button>
              )}
              {qty < 1 && (
                <div className="text-gray-500 text-sm">{t("Please increase quantity to add this product to cart.")}</div>
              )}
              <Button
                onClick={handleBuyNow}
                className="bg-lux-gold text-black px-5 py-2 rounded-lg hover:bg-amber-400 text-lg font-bold shadow"
                aria-label={t("buyNow")}
                tabIndex={0}
              >
                {t("buyNow")} →
              </Button>
              <div className="text-xs mt-2 text-gray-400">
                💡 {t("Click on a product to view details. Use + to increase quantity, and then tap ‘Add to Cart’ to confirm.")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
