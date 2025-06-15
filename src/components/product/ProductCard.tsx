
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
import QuantitySelector from "@/components/QuantitySelector";
import AddToCartButton from "@/components/AddToCartButton";
import ProductQuickView from "@/components/ProductQuickView";

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

  const [qty, setQty] = React.useState(1);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    useWishlistStore.getState().fetchWishlist(user);
  }, [user]);

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

  // Ensure valid quantity state
  React.useEffect(() => {
    if (isOutOfStock) setQty(1);
    else if (qty > product.stock) setQty(product.stock);
    else if (qty < 1) setQty(1);
  }, [product.stock, isOutOfStock]);

  // Modal for details
  const handleCardClick = () => {
    setOpen(true);
    if (onClick) onClick(product);
  };

  const showGuidance = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    toast({
      title: t("productInteractionHint") || "How to add to cart",
      description: t(
        "Click on product for full details. Adjust quantity and tap ‘Add to Cart’ below."
      ),
    });
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

        {/* Info block stays on white background, max width */}
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

          {/* === Add to Cart & Quantity Controls: Always visible, never overlapped === */}
          {!isOutOfStock && (
            <div
              className="mt-3 flex gap-3 flex-wrap items-center bg-white/85 dark:bg-lux-black/60 rounded-lg border border-yellow-100 dark:border-lux-gold/10 p-2 shadow-sm relative z-40"
              onClick={e => e.stopPropagation()}
              style={{
                minHeight: 54,
                // For debug, comment if not needed:
                // background: "rgba(255,0,0,0.10)"
              }}
            >
              <QuantitySelector
                quantity={qty}
                stock={product.stock}
                onInc={() => setQty(q => Math.min(q + 1, product.stock))}
                onDec={() => setQty(q => Math.max(q - 1, 1))}
                disabled={isOutOfStock}
              />
              <AddToCartButton product={{
                id: product.id,
                name: name,
                price: product.price,
                stock: product.stock,
                image: product.image_url
              }} quantity={qty} disabled={isOutOfStock || product.stock < 1} />
            </div>
          )}

          {isOutOfStock && (
            <div className="mt-4 flex items-center justify-center text-red-500 font-semibold text-sm z-40">
              {t("outOfStock") || "Out of Stock"}
            </div>
          )}
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
