
import React from "react";
import Loader from "@/components/Loader";
import ProductGrid from "@/components/ProductGrid";

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
function DebugBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-yellow-100 border border-yellow-600 rounded-xl p-4 my-6 shadow-md"
      style={{ zIndex: 1000 }}
    >
      {children}
    </div>
  );
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
      <DebugBox>
        <div className="text-red-700 font-bold text-lg mb-2">Error</div>
        <div className="text-sm text-gray-800">{error}</div>
        <div className="mt-2 text-yellow-800">
          <strong>Tips:</strong>
          <ul className="list-disc ml-5 text-sm">
            <li>
              If you’re using Supabase and have <span className="font-mono">Row Level Security</span> ON, make sure you have a <span className="font-mono">SELECT USING (true)</span> policy for <span className="font-mono">products</span>.
            </li>
            <li>
              See console logs for more details. Open browser dev tools (F12) and look for "Fetched Products" or "Fetch Products Error".
            </li>
            <li>
              If using a custom REST API, ensure <span className="font-mono">API endpoint</span> is not blocked (CORS/network error).
            </li>
          </ul>
        </div>
      </DebugBox>
    );
  if (!products.length)
    return (
      <DebugBox>
        <p className="text-center text-yellow-900 font-semibold">
          No products found for your search or filters.<br />
          {allProducts.length === 0
            ? "The products list is empty. See data fetch logs above."
            : "Try searching or switching categories, or broaden your search terms."}
        </p>
      </DebugBox>
    );
  // Normal grid
  return <ProductGrid products={products} onCardClick={onCardClick} />;
};
export default ProductList;
