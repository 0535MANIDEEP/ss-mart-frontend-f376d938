
import { useCartStore } from "@/store/cartStore";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import api from "@/api/axios";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import ProductMeta from "@/components/ProductMeta";
import PriceBlock from "@/components/PriceBlock";
import CartActions from "@/components/CartActions";
import ReviewSection from "@/components/ReviewSection";

// Helper for translated fields
function getProductField(
  data: any,
  lang: string,
  fallback: string = ""
): string {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  return data[lang] || data.en || fallback;
}

const ProductDetails = () => {
  const { id } = useParams();
  const items = useCartStore(state => state.items);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const { user, role } = useSupabaseAuth();

  const cartItem = items.find(i => i._id === id?.toString());

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
    }).catch(() => {
      setProduct(null);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-16 text-gray-700">{t("productNotFound")}</div>;

  // --- Translations for local fields per language
  const lang = i18n.language || "en";
  const name = getProductField(product.name, lang, t("noDescription") || "No desc");

  // --- Prepped cart product shape
  const cartProduct = {
    id: product.id,
    name: name,
    price: product.price,
    stock: product.stock,
    image: product.image,
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow p-6 animate-fade-in">
      <ProductMeta product={{ ...product, name: product.name, description: product.description, image: product.image }} lang={lang} />
      <PriceBlock price={product.price} category={product.category} stock={product.stock} />
      <CartActions product={cartProduct} cartItem={cartItem} />
      <ReviewSection role={role} productId={product?.id?.toString()} />
    </div>
  );
};

export default ProductDetails;
