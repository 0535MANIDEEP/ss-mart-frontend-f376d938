import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Loader from "@/components/Loader";
import api from "@/api/axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(false);

    api.get("/products")
      .then((response) => {
        const productsArray = response?.data?.data || [];
        if (mounted) setProducts(productsArray);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        if (mounted) {
          setProducts([]);
          setError(true);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container mx-auto mt-4">
      <h1 className="mb-6 text-3xl font-bold text-center">Shop Products</h1>

      {loading && <Loader />}

      {!loading && error && (
        <p className="text-red-500 text-center mt-8">Error loading products. Please try again later.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-500 text-center mt-8">No products found.</p>
      )}
    </div>
  );
};

export default Home;
