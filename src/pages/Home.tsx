
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import Loader from "@/components/Loader";
import ProductGrid from "@/components/ProductGrid";
import ProductModalManager from "@/components/ProductModalManager";
import FloatingActions from "@/components/FloatingActions";

// Reusable debug helper
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

function HeroSection() {
  const { t } = useTranslation();
  const heroVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 1 as const } },
  };
  const subVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.7 as const } }
  };
  return (
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
  );
}

function CategoryFilter({ category, setCategory }: { category: string; setCategory: (c: string) => void }) {
  const { t } = useTranslation();
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
  );
}

const CATEGORY_MAP: Record<string, string[]> = {
  Groceries: ["Grocery", "Groceries"],
  Snacks: ["Snacks"],
  "Personal Care": ["Personal Care"],
  Beverages: ["Beverages"],
  Household: ["Household"],
  Others: ["Others"],
};

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
// const API_URL = "/api/products"; // If using mock or local

const Home = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Debug: record API responses and errors
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(API_URL)
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Defensive: try both .data and whole array
        const items: Product[] = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
        console.log("Fetched Products:", items);
        setProducts(items);
        if (items.length === 0) {
          setError("No products found from API.");
        }
      })
      .catch((err) => {
        console.error("Fetch Products Error:", err);
        setError(
          [
            "Failed to fetch products.",
            "Are you sure the API endpoint is correct and functioning?",
            "Check CORS/network errors and RLS in Supabase if using direct DB.",
            "If using Supabase, ensure a SELECT policy is enabled like: FOR SELECT USING (true);"
          ].join(" ")
        );
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (category === "All") setFiltered(products);
    else {
      const catOptions = CATEGORY_MAP[category] || [category];
      setFiltered(products.filter((p) => catOptions.includes(p.category)));
    }
  }, [products, category, i18n.language]);

  return (
    <div className="container mx-auto px-2 pt-4 min-h-svh bg-lux-gold/10 relative">
      <HeroSection />
      <CategoryFilter category={category} setCategory={setCategory} />

      {/* Loader */}
      {loading && <Loader />}

      {/* Error or API/Empty fallback */}
      {!loading && (
        <>
          {error && (
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
                    If using a custom REST API, ensure <span className="font-mono">{API_URL}</span> is not blocked (CORS/network error).
                  </li>
                </ul>
              </div>
            </DebugBox>
          )}

          {!error && !filtered.length && (
            <DebugBox>
              <p className="text-center text-yellow-900 font-semibold">
                No products found for this category.<br />
                {products.length === 0
                  ? "The products list is empty. See data fetch logs above."
                  : "Try switching categories or check if the data matches the selected category name."}
              </p>
            </DebugBox>
          )}
        </>
      )}

      {/* Product Grid */}
      {!loading && !error && !!filtered.length && (
        <ProductGrid products={filtered} onCardClick={setSelectedProduct} />
      )}

      <FloatingActions />
      <ProductModalManager selectedProduct={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default Home;
