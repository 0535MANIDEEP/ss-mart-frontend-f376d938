
import React from "react";
import { motion } from "framer-motion";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductControls from "./ProductControls";
import ProductOutOfStockLabel from "./ProductOutOfStockLabel";
import ProductRatings from "./ProductRatings";
import { useTranslation } from "react-i18next";
import { cardVariants } from "./productCardVariants";

/** For i18n multi-language fields */
export type MultiLang = { en: string; hi?: string; te?: string };

/** Primary product type for product card */
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

/**
 * Helper to get translated product field.
 */
function getProductField(
  data: MultiLang | string | undefined,
  lang: string,
  fallback: string = ""
): string {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  return data[lang as keyof MultiLang] || data.en || fallback;
}

/**
 * ProductCard: animated, contained, small and ready for grid.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { t, i18n } = useTranslation();
  if (!product || (typeof product.id !== "number" && typeof product.id !== "string")) {
    return <div className="text-red-500 text-center p-2">{t("productNotFound")}</div>;
  }
  const lang = i18n.language || "en";
  const name = getProductField(product.name, lang, t("noDescription") || "No desc");
  const desc = getProductField(product.description, lang, t("noDescription") || "No desc");

  return (
    <motion.div
      className="lux-card group transition p-4 flex flex-col max-w-xs w-full mx-auto h-full will-change-transform cursor-pointer bg-white dark:bg-lux-black relative"
      style={{ minHeight: 340, borderRadius: 8, margin: 10, padding: 16 }}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate="rest"
      variants={cardVariants}
      tabIndex={0}
      aria-label={onClick ? undefined : t("viewDetails")}
      role="article"
      onClick={onClick ? () => onClick(product) : undefined}
    >
      <ProductOutOfStockLabel stock={product.stock} />
      <ProductImage product={product} name={name} />
      <ProductInfo product={product} name={name} desc={desc} />
      <ProductRatings />
      <ProductControls product={product} name={name} />
    </motion.div>
  );
};

export default ProductCard;
