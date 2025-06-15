
import React from "react";
import { motion } from "framer-motion";
import ProductImage from "./ProductImage";
import ProductOutOfStockLabel from "./ProductOutOfStockLabel";
import WishlistButton from "@/components/WishlistButton";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { cardVariants } from "./productCardVariants";
import ProductMiniQtyControl from "./ProductMiniQtyControl";
import AddToCartButton from "@/components/AddToCartButton";
import { useNavigate } from "react-router-dom";
import ProductQuickView from "@/components/ProductQuickView";
import { Button } from "@/components/ui/button";

export type MultiLang = { en: string; hi?: string; te?: string };
export type Product = {
  id: number | string;
  name: MultiLang | string;
  description: MultiLang | string;
  price: number;
  stock: number;
  category: string;
  image_url?: string | null;
};

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

  React.useEffect(() => {
    // Reset quantity if product/stock changes or out of stock
    if (!product || product.stock <= 0) {
      setQty(0);
    } else if (qty > product.stock) {
      setQty(product.stock);
    }
  }, [product.stock, product.id]);

  if (!product || (typeof product.id !== "number" && typeof product.id !== "string")) {
    return (
      <div className="text-red-500 text-center p-2 border-2 border-red-600 bg-red-100">
        {t("productNotFound") || "PRODUCT NOT FOUND"}
      </div>
    );
  }
  const lang = i18n.language || "en";
  const name = getProductField(product.name, lang, t("noDescription") || "No desc");
  const desc = getProductField(product.description, lang, t("noDescription") || "No desc");
  const isOutOfStock = product.stock <= 0;

  // Ensure quantity never < 0 or > stock
  React.useEffect(() => {
    if (isOutOfStock) setQty(0);
    else if (qty > product.stock) setQty(product.stock);
    else if (qty < 0) setQty(0);
  }, [product.stock, isOutOfStock]);

  // Open modal for full details
  const handleCardClick = () => {
    setOpen(true);
    if (onClick) onClick(product);
  };

  // Toast guidance for card
  const showGuidance = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    toast({
      title: t("productInteractionHint") || "How to add to cart",
      description: t(
        "Click on product for full details. Adjust quantity and tap ‘Add to Cart’ below."
      ),
    });
  };

  // “Add to Cart” behavior: show toast, don't redirect
  const handleAddToCart = () => {
    toast({
      duration: 1200,
      title: t("addedToCart") || "Added to Cart",
      description:
        name && (
          <div className="flex gap-2 items-center">
            <span className="animate-pulse">✅</span>
            <span className="font-semibold whitespace-nowrap">{name}</span>
          </div>
        ),
      variant: "default"
    });
    setQty(0); // Reset mini qty to hide minus/ATC after add
  };

  // Card nav: View product
  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  return (
    <>
      <motion.div
        className={`
          bg-white dark:bg-lux-black rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-visible flex flex-col justify-between min-h-[420px] w-full p-0
          border border-yellow-200 dark:border-lux-gold/40 group relative
          focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
        `}
        style={{ minHeight: 420 }}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        animate="rest"
        variants={cardVariants}
        tabIndex={0}
        aria-label={onClick ? undefined : t("viewDetails")}
        role="article"
        onClick={handleCardClick}
        onKeyDown={e => {
          if (e.key === "Enter") handleCardClick();
          else if (e.key === "?") showGuidance(e);
        }}
        data-testid="product-card"
      >
        {/* Out of Stock & Wishlist always above, no overlap */}
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-2 items-end pointer-events-none">
          <div className="pointer-events-auto">
            <ProductOutOfStockLabel stock={product.stock} />
            <WishlistButton productId={typeof product.id === "string" ? parseInt(product.id) : product.id} />
          </div>
        </div>

        <div className="w-full h-48 md:h-44 relative z-10">
          <ProductImage product={product} name={name} />
        </div>

        {/* Info block: white bg for contrast */}
        <div className="p-4 flex flex-col flex-1 gap-2 pb-3 bg-white dark:bg-lux-black z-20 relative">
          <h3
            className="text-lg font-semibold text-gray-900 dark:text-lux-gold truncate cursor-pointer focus:underline focus:outline-none"
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
          <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2 mb-1" title={desc}>
            {desc || <span className="text-red-600">No desc</span>}
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-green-700 dark:text-lux-gold font-bold text-lg">₹{product.price}</span>
            <span
              className={`
                text-xs px-2 py-1 rounded-full font-medium
                ${isOutOfStock
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"}
              `}
            >
              {isOutOfStock ? t("outOfStock") || "Out of Stock" : t("inStock") || "In Stock"}
            </span>
          </div>

          {/* === Quantity/ATC Controls: Visibility & Logic === */}
          <div className="mt-3 flex gap-2 flex-wrap items-center bg-white/85 dark:bg-lux-black/60 rounded-lg border border-yellow-100 dark:border-lux-gold/10 p-2 shadow-sm relative z-40 min-h-[54px]">
            {/* Only show controls if not out of stock */}
            {!isOutOfStock && (
              <div
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-4 w-full"
              >
                {/* Only show − and count when qty >= 1; + is always visible (unless maxed out) */}
                <ProductMiniQtyControl
                  quantity={qty}
                  stock={product.stock}
                  onInc={() => setQty(q => Math.min(q + 1, product.stock))}
                  onDec={() => setQty(q => Math.max(q - 1, 1))}
                  incDisabled={isOutOfStock || qty >= product.stock}
                  decDisabled={isOutOfStock || qty <= 1}
                />
                {/* ATC: Only if qty > 0 */}
                {qty > 0 && (
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: name,
                      price: product.price,
                      stock: product.stock,
                      image: product.image_url
                    }}
                    quantity={qty}
                    disabled={isOutOfStock || product.stock < 1}
                    onCartChange={handleAddToCart}
                  />
                )}
                {/* ---- BUY NOW REMOVED PER INSTRUCTION (no direct buy in card) ---- */}
              </div>
            )}
            {/* Out of Stock fallback */}
            {isOutOfStock && (
              <div className="flex items-center justify-center text-red-500 font-semibold text-sm z-40 w-full px-2">
                {t("outOfStock") || "Out of Stock"}
              </div>
            )}
          </div>
          {/* View Product Button/Link */}
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full flex items-center justify-center rounded shadow-sm border border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm font-bold py-2"
            onClick={handleViewProduct}
            aria-label={t("viewDetails") || "View Product"}
            tabIndex={0}
            style={{ borderRadius: 8 }}
            type="button"
          >
            {t("viewDetails") || "View Product"}
          </Button>
        </div>
      </motion.div>
      {/* Modal/QuickView for full details */}
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

