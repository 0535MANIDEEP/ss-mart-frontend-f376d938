
import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes";
import type { ProductCardProps } from "./ProductCard";
import { useTranslation } from "react-i18next";

/** Props for ProductInfo subcomponent */
export interface ProductInfoProps {
  product: ProductCardProps['product'];
  name: string;
  desc: string;
}

/**
 * Product title, description, and price block.
 */
const ProductInfo: React.FC<ProductInfoProps> = ({ product, name, desc }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="mb-1">
      <h3
        className="text-lg font-semibold truncate text-lux-black dark:text-lux-gold cursor-pointer group-hover:underline"
        onClick={e => { e.stopPropagation(); navigate(ROUTES.PRODUCT(product.id.toString())); }}
        tabIndex={0}
        title={name}
        style={{ marginBottom: 6 }}
      >
        {name}
      </h3>
      <p className="text-gray-500 dark:text-gray-200 text-sm truncate" title={desc} style={{ marginBottom: 6 }}>
        {desc.slice(0, 56) || t("noDescription") || "No description"}
      </p>
      <span className="text-lux-gold font-bold text-lg">₹{product.price}</span>
    </div>
  );
};
export default React.memo(ProductInfo);
