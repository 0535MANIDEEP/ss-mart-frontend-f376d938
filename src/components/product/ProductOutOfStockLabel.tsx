
import React from "react";

/** Props for ProductOutOfStockLabel */
export interface ProductOutOfStockLabelProps {
  stock: number;
}

/**
 * Shows "Out of Stock" label if stock is zero.
 */
const ProductOutOfStockLabel: React.FC<ProductOutOfStockLabelProps> = ({ stock }) =>
  stock <= 0 ? (
    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded z-10 text-xs font-bold shadow-lg">
      Out of Stock
    </div>
  ) : null;
export default React.memo(ProductOutOfStockLabel);
