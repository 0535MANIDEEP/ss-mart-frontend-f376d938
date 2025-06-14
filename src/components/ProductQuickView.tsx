
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ProductQuickViewProps {
  product: any;
  open: boolean;
  onClose: () => void;
}

const DopamineConfirm = () => (
  <div className="flex items-center gap-2">
    <span className="animate-pulse">✅</span>
    <span className="font-semibold text-lux-gold">Added to cart!</span>
  </div>
);

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
      description: <DopamineConfirm />,
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
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDec}
                aria-label={t("subtract")}
                disabled={qty <= 1}
                className="rounded-full"
                tabIndex={0}
              ><Minus size={20} /></Button>
              <span className="font-semibold text-lg px-2">{qty}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleInc}
                aria-label={t("add")}
                disabled={qty >= stock}
                className="rounded-full"
                tabIndex={0}
              ><Plus size={20} /></Button>
            </div>
            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => { handleAdd(); onClose(); }}
                className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 text-lg font-semibold shadow"
                aria-label={t("addToCart")}
                tabIndex={0}
              >
                <ShoppingCart size={20} /> {t("addToCart")}
              </Button>
              <Button
                onClick={handleBuyNow}
                className="bg-lux-gold text-black px-5 py-2 rounded-lg hover:bg-amber-400 text-lg font-bold shadow"
                aria-label={t("buyNow")}
                tabIndex={0}
              >
                {t("buyNow")} →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
