
import React from "react";
import { motion } from "framer-motion";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductControls from "./ProductControls";
import ProductOutOfStockLabel from "./ProductOutOfStockLabel";
import ProductRatings from "./ProductRatings";
import { useTranslation } from "react-i18next";
import { cardVariants } from "./productCardVariants";

export type MultiLang = { en: string; hi?: string; te?: string };

export type Product = {
  id: number | string;
  name: MultiLang | string;
  description: MultiLang | string;
  price: number;
  stock: number;
  category: string;
  image_url?: string | null;
  // Optionally: badges?: string[]
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
  if (!product || (typeof product.id !== "number" && typeof product.id !== "string")) {
    return <div className="text-red-500 text-center p-2">{t("productNotFound")}</div>;
  }
  const lang = i18n.language || "en";
  const name = getProductField(product.name, lang, t("noDescription") || "No desc");
  const desc = getProductField(product.description, lang, t("noDescription") || "No desc");

  // Example: dynamic badges (add logic later for real conditions)
  const showBadge = product.stock <= 5
    ? { text: t("stock"), color: "bg-red-100 text-red-700 border border-red-300" }
    : null;
  // Out of stock
  const outOfStock = product.stock <= 0;

  return (
    <motion.div
      className={`
        rounded-xl shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-[#181929]
        flex flex-col border border-gray-200 dark:border-lux-gold/25 relative
        group h-full w-full max-w-xs mx-auto p-0
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
      `}
      style={{ minHeight: 380 }}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate="rest"
      variants={cardVariants}
      tabIndex={0}
      aria-label={onClick ? undefined : t("viewDetails")}
      role="article"
      onClick={onClick ? () => onClick(product) : undefined}
      data-testid="product-card"
    >
      {/* Optional badge, like "Low Stock", "New", etc */}
      {showBadge && (
        <div
          className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold z-30 ${showBadge.color}`}
          aria-label={showBadge.text}
        >
          {outOfStock ? t("removedFromCart") : t("stock", { count: product.stock })}
        </div>
      )}

      {/* Out of stock label always appears above image */}
      <ProductOutOfStockLabel stock={product.stock} />

      {/* Card layout: Image at top, then info, then controls */}
      <div className="relative aspect-[1/1] w-full overflow-hidden flex items-center justify-center mb-0 rounded-t-xl">
        {/* Product image: full, 1/1 ratio, zoom on hover */}
        <div className="w-full h-full">
          <ProductImage
            product={product}
            name={name}
          />
        </div>
        {/* Hover zoom effect on img */}
        <div
          className="absolute inset-0 pointer-events-none rounded-t-xl"
          aria-hidden="true"
        />
      </div>

      {/* Info block: name, desc, ratings, price, stock */}
      <div className="flex flex-col gap-1 px-4 pt-4 pb-2 min-h-[110px]">
        {/* Product name/title */}
        <h3
          className="text-base font-semibold text-lux-black dark:text-lux-gold line-clamp-2 mb-0 cursor-pointer group-hover:underline focus:underline"
          title={name}
          tabIndex={0}
          aria-label={name}
          style={{ minHeight: 48 }}
          onClick={e => {
            e.stopPropagation();
            if (onClick) onClick(product);
          }}
        >
          {name}
        </h3>
        {/* Description */}
        <p
          className="text-xs text-gray-600 dark:text-gray-300 mt-0 mb-1 line-clamp-2"
          title={desc}
        >
          {desc}
        </p>
        {/* Ratings placeholder */}
        <ProductRatings />
        <div className="flex items-center gap-2">
          <span className="text-primary text-xl font-bold">
            ₹{product.price}
          </span>
          <span className={`ml-auto text-[13px] px-2 rounded ${outOfStock ? "bg-red-100 text-red-600" : "bg-emerald-50 text-emerald-800"}`}>
            {outOfStock
              ? t("removedFromCart") || "Out of stock"
              : t("stock", { count: product.stock }) || `Stock: ${product.stock}`
            }
          </span>
        </div>
      </div>

      {/* Actions: QuantitySelector, Add to Cart, Buy Now */}
      <div className="flex flex-col gap-2 px-4 pb-4 mt-auto w-full">
        <ProductControls
          product={product}
          name={name}
        />
      </div>
    </motion.div>
  );
};

export default ProductCard;
