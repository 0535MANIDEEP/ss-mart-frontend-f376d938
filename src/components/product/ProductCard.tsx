
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
  // Debug: log the product each render!
  console.log("ProductCard rendering:", product);

  if (!product || (typeof product.id !== "number" && typeof product.id !== "string")) {
    return <div className="text-red-500 text-center p-2 border-2 border-red-600 bg-red-100">
      {t("productNotFound") || "PRODUCT NOT FOUND"}
    </div>;
  }
  const lang = i18n.language || "en";
  const name = getProductField(product.name, lang, t("noDescription") || "No desc");
  const desc = getProductField(product.description, lang, t("noDescription") || "No desc");

  const showBadge = product.stock <= 5
    ? { text: t("stock"), color: "bg-red-100 text-red-700 border border-red-300" }
    : null;
  // Out of stock
  const outOfStock = product.stock <= 0;

  // MAIN DEBUG WRAP
  return (
    <motion.div
      className={`
        relative group h-full w-full max-w-xs mx-auto
        p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
        flex flex-col rounded-2xl border-8 border-red-700 
        shadow-2xl bg-blue-300/60 !min-h-[420px] 
        items-center justify-center z-40
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
      onClick={onClick ? () => onClick(product) : undefined}
      data-testid="product-card"
    >
      {/* *** MASSIVE DEBUG BANNER *** */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
        <span className="text-5xl font-extrabold text-red-700 bg-yellow-300/80 px-6 py-5 rounded-lg border-4 border-red-800 shadow-2xl">
          PRODUCT #{product.id}
        </span>
      </div>
      {/* --- Everything else is behind debug banner --- */}
      <div className="relative flex flex-col items-center w-full overflow-hidden justify-center mb-0 rounded-t-xl border border-yellow-800 bg-yellow-300/40 min-h-[150px]">
        <ProductImage
          product={product}
          name={name}
        />
      </div>

      <div className="flex flex-col gap-1 px-4 pt-4 pb-2 min-h-[110px] bg-pink-100 border border-pink-400 w-full">
        <h3
          className="text-base font-semibold text-lux-black dark:text-lux-gold line-clamp-2 mb-0 cursor-pointer group-hover:underline focus:underline"
          title={name}
          tabIndex={0}
          aria-label="name"
          style={{ minHeight: 32 }}
          onClick={e => {
            e.stopPropagation();
            if (onClick) onClick(product);
          }}
        >
          {name || <span className="text-red-600">No name</span>}
        </h3>
        <p
          className="text-xs text-gray-600 dark:text-gray-300 mt-0 mb-1 line-clamp-2"
          title={desc}
        >
          {desc || <span className="text-red-600">No desc</span>}
        </p>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-4 mt-auto w-full bg-yellow-50 border-t-2 border-yellow-700">
        <div>DEBUG: Controls</div>
        <ProductControls
          product={product}
          name={name}
        />
      </div>
    </motion.div>
  );
};

export default ProductCard;

