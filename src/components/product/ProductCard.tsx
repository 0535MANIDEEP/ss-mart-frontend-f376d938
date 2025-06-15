
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import "./ProductCard.css";
import ProductOutOfStockLabel from "./ProductOutOfStockLabel";
import WishlistButton from "@/components/WishlistButton";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { cardVariants } from "./productCardVariants";
import { Button } from "@/components/ui/button";
import ProductQuickView from "@/components/ProductQuickView";
import ProductImage from "./ProductImage";
import AddToCartButton from "@/components/AddToCartButton";
import { useCartStore } from "@/store/cartStore";
import QuantitySelector from "@/components/QuantitySelector"; // can use if you like

export type MultiLang = { en: string; hi?: string; te?: string };

// Ensures codebase-wide interface is used
export interface ProductCardProps {
  product: any;
  onClick?: (prod: any) => void;
}

function getProductField(
  data: MultiLang | string | undefined,
  lang: string,
  fallback: string = ""
): string {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  return data[lang as keyof MultiLang] || data.en || fallback;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { t, i18n } = useTranslation();
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const { items: cartItems, addToCart } = useCartStore();

  const [open, setOpen] = React.useState(false);

  // Find if this item is already in the cart
  const cartItem = cartItems.find(
    (item: any) => item._id === product.id?.toString()
  );

  // If cart has this, init local quantity to what's in the cart, else 0
  const [qty, setQty] = React.useState(cartItem ? cartItem.quantity : 0);

  // Sync local quantity to reflect cart if ever changed elsewhere
  React.useEffect(() => {
    if (cartItem && cartItem.quantity !== qty) setQty(cartItem.quantity);
    // If product is out of stock, force to 0
    if (!product || product.stock <= 0) setQty(0);
    else if (qty > product.stock) setQty(product.stock);
    // eslint-disable-next-line
  }, [cartItem?.quantity, product.stock, product.id]);

  React.useEffect(() => {
    useWishlistStore.getState().fetchWishlist(user);
  }, [user]);

  const lang = i18n.language || "en";
  const name = getProductField(product.name, lang, t("noDescription") || "No desc");
  const desc = getProductField(product.description, lang, t("noDescription") || "No desc");
  const isOutOfStock = product.stock <= 0;

  // Universal: feedback (never reset local qty after add)
  const handleAddToCart = () => {
    if (qty > 0) {
      // Do add
      addToCart({
        _id: product.id.toString(),
        name,
        price: product.price,
        quantity: qty,
        stock: product.stock,
        image: product.image_url,
      }, qty);

      toast({
        duration: 1400,
        title: t("addedToCart"),
        description: (
          <div className="flex items-center gap-2">
            <span className="animate-pulse">✅</span>
            <span className="font-semibold">{name} ({qty})</span>
          </div>
        ),
        variant: "default",
      });
      // ❌ Don't reset qty state here!
      // Optionally: you can disable inputs or show "already in cart" after add
    }
  };

  const goToProductPage = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  // Guidance toast
  const showGuidance = (e: React.KeyboardEvent | React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: t("productInteractionHint"),
      description: t(
        "Click product image/name for full details. Adjust quantity, then tap 'Add to Cart'."
      ),
    });
  };

  return (
    <>
      <motion.div
        className="product-card-root group"
        style={{ minHeight: 420 }}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        animate="rest"
        variants={cardVariants}
        tabIndex={0}
        aria-label={t("viewDetails")}
        role="article"
        onClick={() => { setOpen(true); if (onClick) onClick(product); }}
        onKeyDown={e => {
          if (e.key === "Enter") { setOpen(true); if (onClick) onClick(product);}
          else if (e.key === "?") showGuidance(e);
        }}
        data-testid="product-card"
      >
        {/* Top edge overlays */}
        <div className="product-card-top-edges">
          <ProductOutOfStockLabel stock={product.stock} />
          <WishlistButton productId={typeof product.id === "string" ? parseInt(product.id) : product.id} />
        </div>
        <div
          className="product-card-image"
          tabIndex={0}
          aria-label={name}
          role="button"
          title={name}
          onClick={goToProductPage}
          onKeyDown={e => {
            if (e.key === "Enter") goToProductPage(e);
          }}
        >
          <ProductImage product={product} name={name} />
        </div>
        <div className="product-card-info">
          <h3
            className="font-bold truncate text-lg card-title focus:underline cursor-pointer"
            title={name}
            tabIndex={0}
            aria-label={name}
            onClick={e => {
              e.stopPropagation();
              setOpen(true);
            }}
            style={{ minHeight: 32 }}
          >
            {name || <span className="text-red-600">No name</span>}
          </h3>
          <p className="product-card-desc" title={desc}>
            {desc || <span className="text-red-600">No desc</span>}
          </p>
          <div className="flex items-center justify-between mt-1 gap-2">
            <span className="text-green-700 font-bold text-lg">₹{product.price}</span>
            <span
              className={`
                text-xs px-2 py-1 rounded-full font-medium
                ${isOutOfStock
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"}
              `}
              style={{ minWidth: 85, textAlign: "center" }}
            >
              {isOutOfStock ? t("outOfStock") || "Out of Stock" : t("inStock") || "In Stock"}
            </span>
          </div>
          <div className="product-card-controls">
            {!isOutOfStock ? (
              <div className="qty-atc-row" onClick={e => e.stopPropagation()}>
                {/* You can use your custom reusable QuantitySelector here:
                  <QuantitySelector
                    quantity={qty}
                    stock={product.stock}
                    onInc={() => setQty(q => Math.min(product.stock, q + 1))}
                    onDec={() => setQty(q => Math.max(1, q - 1))}
                  />
                */}
                <button
                  aria-label={t("subtract") || "Minus"}
                  className="qty-btn"
                  type="button"
                  disabled={qty <= 1}
                  tabIndex={0}
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                >
                  <Minus size={20} />
                </button>
                <span className="qty-count" aria-live="polite" tabIndex={0}>
                  {qty}
                </span>
                <button
                  aria-label={t("add") || "Plus"}
                  className="qty-btn"
                  type="button"
                  disabled={qty >= product.stock}
                  tabIndex={0}
                  onClick={() => setQty(q => Math.min(q + 1, product.stock))}
                >
                  <Plus size={20} />
                </button>
                {/* AddToCart appears only when qty > 0 */}
                {qty > 0 && (
                  <Button
                    size="default"
                    className="lux-btn text-base gap-1 relative overflow-hidden min-h-[44px] rounded-[8px] !px-6 focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none animate-fade-in"
                    aria-label={t("addToCart")}
                    onClick={handleAddToCart}
                    type="button"
                    disabled={isOutOfStock || product.stock < 1}
                    tabIndex={0}
                    style={{ minHeight: 44, borderRadius: 8 }}
                  >
                    <span className="mr-1"><Plus size={18} /></span> {t("addToCart")}
                  </Button>
                )}
              </div>
            ) : (
              <div className="out-of-stock-text">
                {t("outOfStock") || "Out of Stock"}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="view-product-btn"
            onClick={goToProductPage}
            aria-label={t("viewDetails")}
            tabIndex={0}
            type="button"
          >
            {t("viewDetails") || "View Product"}
          </Button>
        </div>
      </motion.div>
      {open && (
        <ProductQuickView
          product={product}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ProductCard;

