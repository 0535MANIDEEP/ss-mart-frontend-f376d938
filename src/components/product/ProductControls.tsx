
import React from "react";
import QuantitySelector from "@/components/QuantitySelector";
import type { Product } from "./ProductCard";

/** Props for ProductControls */
export interface ProductControlsProps {
  product: Product;
  name: string;
}

/**
 * Only allows quantity selection, never add-to-cart. 
 * Main add-to-cart logic is now only in the ProductQuickView modal.
 */
const ProductControls: React.FC<ProductControlsProps> = ({ product }) => {
  // Card does not allow cart action, only quantity visual (optionally could remove this for MVP)
  // For strict flow, render nothing
  return <></>;
};

export default React.memo(ProductControls);
