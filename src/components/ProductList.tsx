
import React from "react";
import Loader from "@/components/Loader";
import ProductGrid from "@/components/ProductGrid";
/**
 * ProductList shows a loader/error/debug before showing the grid of ProductCards
 */
type Product = {
  id: number | string;
  name: any;
  description: any;
  price: number;
  stock: number;
  category: string;
  image_url?: string | null;
};
interface ProductListProps {
  loading: boolean;
  error: string | null;
  products: Product[];
  allProducts: Product[];
  onCardClick: (product: Product) => void;
}
const ProductList: React.FC<ProductListProps> = ({
  loading,
  error,
  products,
  allProducts,
  onCardClick,
}) => {
  if (loading) return <Loader />;
  if (error)
    return (
      <div className="bg-yellow-100 border border-yellow-600 rounded-xl p-4 my-6 shadow-md text-center">
        <div className="text-red-700 font-bold text-lg mb-2">Error</div>
        <div className="text-sm text-gray-800">{error}</div>
      </div>
    );
  if (!products.length)
    return (
      <div className="bg-yellow-100 border border-yellow-600 rounded-xl p-4 my-6 shadow-md text-center">
        <p className="text-yellow-900 font-semibold">
          No products found for your search or filters.<br />
          {allProducts.length === 0
            ? "No products in inventory. Contact admin."
            : "Try searching or changing category."}
        </p>
      </div>
    );
  // Normal grid
  return <ProductGrid products={products} onCardClick={onCardClick} />;
};
export default ProductList;
