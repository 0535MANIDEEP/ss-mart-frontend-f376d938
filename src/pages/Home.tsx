
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Loader from "@/components/Loader";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
};

const API_URL = "https://ss-mart-backend.onrender.com/api/products";

const categoryList = [
  "All",
  "Groceries",
  "Personal Care",
  "Beverages",
  "Snacks",
  "Household",
  "Others"
];

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(API_URL)
      .then(res => res.json())
      .then((data) => {
        const items: Product[] = Array.isArray(data?.data) ? data.data : [];
        setProducts(items);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (category === "All") setFiltered(products);
    else setFiltered(products.filter(p => p.category === category));
  }, [products, category]);

  return (
    <div className="container mx-auto px-2 pt-4">
      {/* Hero Section */}
      <section className="lux-hero animate-fade-in w-full max-w-2xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold mb-2 tracking-tight">Welcome to SS MART</h1>
        <p className="text-lg mb-2 mt-2 leading-relaxed">Sai Sangameshwara Mart &mdash; Shankarpally’s luxury marketplace.</p>
        <div className="flex items-center gap-2 text-sm text-lux-gold font-medium">
          <svg className="inline mr-1" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="10" cy="10" r="9" stroke="#D4AF37"/><path d="M10 10v4l2 2" stroke="#D4AF37"/><path d="M10 6a4 4 0 1 1-2.8 1.2" stroke="#D4AF37"/>
          </svg>
          Shankarpally, Telangana &bull;&nbsp;
          <a href="https://g.co/kgs/v1e9RSN" className="underline hover:text-lux-gold" target="_blank" rel="noopener">Google Maps</a>
        </div>
      </section>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap justify-center mb-6">
        {categoryList.map(cat => (
          <button
            className={`lux-category-btn${cat === category ? " active" : ""}`}
            key={cat}
            onClick={() => setCategory(cat)}
          >{cat}</button>
        ))}
      </div>

      {/* Loading */}
      {loading && <Loader />}

      {/* Error fallback */}
      {!loading && error && (
        <p className="text-red-600 text-center mt-12 text-lg font-semibold">Error loading products.<br />Please try again later.</p>
      )}

      {/* Product List */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 animate-fade-in">
          {filtered.map((p: Product) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-gray-500 text-center my-14 text-xl">
          No products found in this category.
        </div>
      )}
    </div>
  );
};

export default Home;
