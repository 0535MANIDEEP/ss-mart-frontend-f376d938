
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

  // Debug log for inspection
  console.log("DEBUG RENDER ProductCard", { product, name, desc });

  return (
    <motion.div
      className="lux-card group transition p-4 flex flex-col max-w-xs w-full mx-auto h-full will-change-transform cursor-pointer bg-yellow-100 border-4 border-blue-400 relative shadow-md"
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
      <div className="absolute left-2 top-2 bg-pink-200 text-xs text-black px-2 rounded z-50 font-bold pointer-events-none">CARD</div>
      <div className="border border-dashed border-lime-600 mb-2 p-1">
        <span className="text-xs text-lime-800">OutOfStockLabel</span>
        <ProductOutOfStockLabel stock={product.stock} />
      </div>
      <div className="border border-dashed border-cyan-400 mb-2 p-1">
        <span className="text-xs text-cyan-800">ProductImage</span>
        <ProductImage product={product} name={name} />
      </div>
      <div className="border border-dashed border-orange-400 mb-2 p-1">
        <span className="text-xs text-orange-800">ProductInfo</span>
        <ProductInfo product={product} name={name} desc={desc} />
      </div>
      <div className="border border-dashed border-violet-400 mb-2 p-1">
        <span className="text-xs text-violet-800">ProductRatings</span>
        <ProductRatings />
      </div>
      <div className="border border-dashed border-green-600 mt-auto p-1">
        <span className="text-xs text-green-800">ProductControls</span>
        <ProductControls product={product} name={name} />
      </div>
    </motion.div>
  );
};

export default ProductCard;
