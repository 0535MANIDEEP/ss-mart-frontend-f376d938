
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Loader from "@/components/Loader";
import ProductGrid from "@/components/ProductGrid";
import ProductModalManager from "@/components/ProductModalManager";
import FloatingActions from "@/components/FloatingActions";

type MultiLang = { en: string; hi?: string; te?: string };
type Product = {
  id: number | string;
  name: MultiLang | string;
  description: MultiLang | string;
  price: number;
  stock: number;
  category: string;
  image_url?: string | null;
};

const API_URL = "https://ss-mart-backend.onrender.com/api/products";

const Home = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const heroVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 1 } }
  };

  const subVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.7 } }
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

  const categoryList = [
    { label: t("all"), value: "All" },
    { label: t("categories.groceries"), value: "Groceries" },
    { label: t("categories.personalCare"), value: "Personal Care" },
    { label: t("categories.beverages"), value: "Beverages" },
    { label: t("categories.snacks"), value: "Snacks" },
    { label: t("categories.household"), value: "Household" },
    { label: t("categories.others"), value: "Others" }
  ];

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
            {t("brand")}
          </span>
        </motion.h1>
        <motion.p
          className="text-lg mb-2 mt-2 leading-relaxed text-lux-gold/90 font-medium"
          variants={subVariants}
        >
          Sai Sangameshwara Mart &mdash; {t("shankarpally")}'s luxury marketplace.
        </motion.p>
        <motion.div
          className="flex items-center gap-2 text-sm text-lux-gold font-medium"
          variants={subVariants}
        >
          <svg className="inline mr-1" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="10" cy="10" r="9" stroke="#FFD700"/><path d="M10 10v4l2 2" stroke="#FFD700"/><path d="M10 6a4 4 0 1 1-2.8 1.2" stroke="#FFD700"/>
          </svg>
          {t("shankarpally")}, Telangana &bull;&nbsp;
          <a
            href="https://g.co/kgs/v1e9RSN"
            className="underline hover:text-lux-gold"
            target="_blank"
            rel="noopener"
            aria-label={t("googleMaps")}
          >
            {t("googleMaps")}
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
            className={`lux-category-btn${cat.value === category ? " active" : ""}`}
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            aria-label={`Show ${cat.label} products`}
            aria-selected={cat.value === category}
            tabIndex={0}
            role="tab"
          >{cat.label}</button>
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
          {t("errorLoading")}
        </motion.p>
      )}

      {/* Product Grid (re-uses all the same props/components) */}
      {!loading && !error && (
        <ProductGrid products={filtered} onCardClick={setSelectedProduct} />
      )}

      {/* Floating Actions */}
      <FloatingActions />

      {/* Modal manager (handles ProductQuickView) */}
      <ProductModalManager selectedProduct={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default Home;
