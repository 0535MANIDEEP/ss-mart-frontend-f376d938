
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
import type { Product } from "./ProductCard";
import ProductImage from "./ProductImage";
import AddToCartButton from "@/components/AddToCartButton";

export type MultiLang = { en: string; hi?: string; te?: string };

// Ensures codebase-wide interface is used
export interface ProductCardProps {
  product: Product;
  onClick?: (prod: Product) => void;
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

  const [qty, setQty] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    useWishlistStore.getState().fetchWishlist(user);
  }, [user]);

  // Reset quantity if product/stock changes or out of stock
  React.useEffect(() => {
    if (!product || product.stock <= 0) setQty(0);
    else if (qty > product.stock) setQty(product.stock);
  }, [product.stock, product.id]);

  const lang = i18n.language || "en";
  const name = getProductField(product.name, lang, t("noDescription") || "No desc");
  const desc = getProductField(product.description, lang, t("noDescription") || "No desc");
  const isOutOfStock = product.stock <= 0;

  // Never negative or above stock:
  React.useEffect(() => {
    if (isOutOfStock && qty !== 0) setQty(0);
    else if (qty > product.stock) setQty(product.stock);
    else if (qty < 0) setQty(0);
  }, [product.stock, isOutOfStock, qty]);

  // View full details in modal (or delegate to parent)
  const handleCardClick = () => {
    setOpen(true);
    if (onClick) onClick(product);
  };

  // Keyboard: enter = open modal; ? = show UX hint
  const showGuidance = (e: React.KeyboardEvent | React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: t("productInteractionHint"),
      description: t(
        "Click product image/name for full details. Adjust quantity, then tap 'Add to Cart'."
      ),
    });
  };

  // Add to cart feedback
  const handleAddToCart = () => {
    toast({
      duration: 1400,
      title: t("addedToCart"),
      description: (
        <div className="flex items-center gap-2">
          <span className="animate-pulse">✅</span>
          <span className="font-semibold">{name}</span>
        </div>
      ),
      variant: "default",
    });
    setQty(0);
  };

  // Always route to `/products/:id`
  const goToProductPage = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
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
        onClick={handleCardClick}
        onKeyDown={e => {
          if (e.key === "Enter") handleCardClick();
          else if (e.key === "?") showGuidance(e);
        }}
        data-testid="product-card"
      >
        {/* Top edge overlays: out of stock, wishlist */}
        <div className="product-card-top-edges">
          <ProductOutOfStockLabel stock={product.stock} />
          <WishlistButton productId={typeof product.id === "string" ? parseInt(product.id) : product.id} />
        </div>

        {/* Main image */}
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

        {/* Card info */}
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

          {/* Qty & Add to Cart */}
          <div className="product-card-controls">
            {!isOutOfStock ? (
              <div className="qty-atc-row" onClick={e => e.stopPropagation()}>
                <button
                  aria-label={t("subtract") || "Minus"}
                  className="qty-btn"
                  type="button"
                  disabled={qty <= 0}
                  tabIndex={0}
                  onClick={() => setQty(q => Math.max(0, q - 1))}
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
                {/* Add to Cart: appears only when qty > 0 */}
                {qty > 0 && (
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name,
                      price: product.price,
                      stock: product.stock,
                      image: product.image_url,
                    }}
                    quantity={qty}
                    disabled={isOutOfStock || product.stock < 1}
                    onCartChange={handleAddToCart}
                  />
                )}
              </div>
            ) : (
              <div className="out-of-stock-text">
                {t("outOfStock") || "Out of Stock"}
              </div>
            )}
          </div>

          {/* View Product button */}
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

