
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import FloatingActions from "@/components/FloatingActions";
import ProductModalManager from "@/components/ProductModalManager";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import HeroSection from "@/components/HeroSection";
import ProductList from "@/components/ProductList";

// Types
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

const CATEGORY_MAP: Record<string, string[]> = {
  Groceries: ["Grocery", "Groceries"],
  Snacks: ["Snacks"],
  "Personal Care": ["Personal Care"],
  Beverages: ["Beverages"],
  Household: ["Household"],
  Others: ["Others"],
};

const API_URL = "https://ss-mart-backend.onrender.com/api/products";

const Home = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products from API
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(API_URL)
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
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

  // Filtered & searched products
  const filtered = useMemo(() => {
    let filteredList = products;
    if (category && category !== "All") {
      const catOptions = CATEGORY_MAP[category] || [category];
      filteredList = filteredList.filter((p) => catOptions.includes(p.category));
    }
    if (search.trim()) {
      filteredList = filteredList.filter((p) => {
        const getField = (f: MultiLang | string | undefined) =>
          typeof f === "string"
            ? f
            : f?.[i18n.language as keyof MultiLang] || f?.en || "";
        const name = getField(p.name).toLowerCase();
        const desc = getField(p.description).toLowerCase();
        const term = search.trim().toLowerCase();
        return (
          name.includes(term) ||
          desc.includes(term) ||
          (p.category?.toLowerCase() || "").includes(term)
        );
      });
    }
    return filteredList;
  }, [products, search, category, i18n.language]);

  return (
    <div className="container mx-auto px-2 pt-4 min-h-svh bg-lux-gold/10 relative">
      <HeroSection />
      <SearchBar value={search} onChange={setSearch} />
      <CategoryFilter category={category} setCategory={setCategory} />
      <ProductList
        loading={loading}
        error={error}
        products={filtered}
        allProducts={products}
        onCardClick={setSelectedProduct}
      />
      <FloatingActions />
      <ProductModalManager
        selectedProduct={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Home;
