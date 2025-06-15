
import React from "react";
import { motion } from "framer-motion";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductControls from "./ProductControls";
import ProductOutOfStockLabel from "./ProductOutOfStockLabel";
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

  // Refined card visuals
  return (
    <motion.div
      className={`
        bg-white dark:bg-lux-black rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between min-h-[420px] w-full p-0
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
      onClick={onClick ? () => onClick(product) : undefined}
      data-testid="product-card"
    >
      {/* Out of Stock Label, visually prominent in a modern way */}
      <div className="absolute top-3 right-3 z-20">
        <ProductOutOfStockLabel stock={product.stock} />
      </div>

      <div className="w-full h-48 md:h-44 relative">
        <ProductImage product={product} name={name} />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2 pb-3">
        <h3
          className="text-lg font-semibold text-gray-900 dark:text-lux-gold truncate"
          title={name}
          tabIndex={0}
          aria-label={name}
          onClick={e => {
            e.stopPropagation();
            if (onClick) onClick(product);
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

        {/* Controls */}
        <div className="mt-4 flex gap-2">
          {/* Add to Cart and Buy Now (from ProductControls preserves all integrations) */}
          <div className="flex-1">
            <ProductControls product={product} name={name} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
