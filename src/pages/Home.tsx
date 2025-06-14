
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Loader from "@/components/Loader";
import { motion, AnimatePresence } from "framer-motion";

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

  // Animated Hero Headline Variants
  const heroVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, duration: 1 } }
  };

  const subVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.7 } }
  };

  // Animate reveal for grid
  const gridVariants = {
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
  };

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
    <div className="container mx-auto px-2 pt-4 min-h-svh">
      {/* Hero Section */}
      <motion.section
        className="lux-hero animate-fade-in w-full max-w-2xl mx-auto"
        initial="hidden"
        animate="visible"
        aria-label="SS MART Introduction"
      >
        <motion.h1
          className="text-4xl lg:text-5xl font-bold mb-2 tracking-tight font-sans"
          variants={heroVariants}
        >
          <span className="bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(212,175,55,0.15)]">
            Welcome to SS MART
          </span>
        </motion.h1>
        <motion.p
          className="text-lg mb-2 mt-2 leading-relaxed text-lux-gold/90 font-medium"
          variants={subVariants}
        >
          Sai Sangameshwara Mart &mdash; Shankarpally’s luxury marketplace.
        </motion.p>
        <motion.div
          className="flex items-center gap-2 text-sm text-lux-gold font-medium"
          variants={subVariants}
        >
          <svg className="inline mr-1" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="10" cy="10" r="9" stroke="#FFD700"/><path d="M10 10v4l2 2" stroke="#FFD700"/><path d="M10 6a4 4 0 1 1-2.8 1.2" stroke="#FFD700"/>
          </svg>
          Shankarpally, Telangana &bull;&nbsp;
          <a
            href="https://g.co/kgs/v1e9RSN"
            className="underline hover:text-lux-gold"
            target="_blank"
            rel="noopener"
            aria-label="Google Maps: SS Mart"
          >
            Google Maps
          </a>
        </motion.div>
      </motion.section>

      {/* Category Filters */}
      <motion.div
        className="flex gap-2 flex-wrap justify-center mb-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.7 } }}
        aria-label="Product Categories"
        role="tablist"
      >
        {categoryList.map(cat => (
          <button
            className={`lux-category-btn${cat === category ? " active" : ""}`}
            key={cat}
            onClick={() => setCategory(cat)}
            aria-label={`Show ${cat} products`}
            aria-selected={cat === category}
            tabIndex={0}
            role="tab"
          >{cat}</button>
        ))}
      </motion.div>

      {/* Loading */}
      {loading && <Loader />}

      {/* Error fallback */}
      {!loading && error && (
        <motion.p
          className="text-red-600 text-center mt-12 text-lg font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          aria-live="polite"
        >
          Error loading products.<br />
          Please try again later.
        </motion.p>
      )}

      {/* Product List with animated grid */}
      {!loading && !error && filtered.length > 0 && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 animate-fade-in"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filtered.map((p: Product) => (
              <motion.div
                key={p.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, duration: 0.55 } }
                }}
                exit={{ opacity: 0, scale: 0.92, filter: "blur(4px)", transition: { duration: 0.3 } }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <motion.div
          className="text-gray-500 text-center my-14 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          aria-live="polite"
        >
          No products found in this category.
        </motion.div>
      )}
    </div>
  );
};

export default Home;
