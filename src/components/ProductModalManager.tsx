
import React from "react";
import ProductQuickView from "./ProductQuickView";

interface ProductModalManagerProps {
  selectedProduct: any | null;
  onClose: () => void;
}

const ProductModalManager: React.FC<ProductModalManagerProps> = ({ selectedProduct, onClose }) => {
  if (!selectedProduct) return null;
  return (
    <ProductQuickView
      product={selectedProduct}
      open={true}
      onClose={onClose}
    />
  );
};

export default ProductModalManager;
