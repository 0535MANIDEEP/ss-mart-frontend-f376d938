
import React from "react";
import type { ProductCardProps } from "./ProductCard";

/** Props for ProductControls */
export interface ProductControlsProps {
  product: ProductCardProps['product'];
  name: string;
}

/**
 * Only allows quantity selection, never add-to-cart. 
 * Main add-to-cart logic is now only in the ProductQuickView modal.
 */
const ProductControls: React.FC<ProductControlsProps> = ({ product }) => {
  // Card does not allow cart action, only quantity visual
  return <></>;
};

export default React.memo(ProductControls);
