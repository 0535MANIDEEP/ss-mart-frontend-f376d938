import { useCartStore } from "@/store/cartStore";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import ProductReviews from "@/components/ProductReviews";

const DopamineConfirm = () => (
  <div className="flex items-center gap-2">
    <span className="animate-pulse">✅</span>
    <span className="font-semibold text-lux-gold">Added to cart!</span>
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const addToCart = useCartStore(state => state.addToCart);
  const updateQty = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const items = useCartStore(state => state.items);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const imgRef = useRef<HTMLImageElement>(null);

  // Always re-calc cartItem for current product
  const cartItem = items.find(i => i._id === id?.toString());
  const stock = product?.stock ?? 0;
  // qty displayed always matches cart if in cart, else local qty
  const [qty, setQty] = useState<number>(cartItem?.quantity || 1);

  // Fetch product & sync local qty with cart every change
  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
    }).catch(() => {
      setProduct(null);
    }).finally(() => setLoading(false));
  }, [id]);

  // Whenever cartItem changes, update qty in UI to always match
  useEffect(() => {
    // Always sync displayed qty if in cart, else use 1
    setQty(cartItem?.quantity || 1);
    // eslint-disable-next-line
  }, [cartItem?.quantity, items.length]);

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-16 text-gray-700">Product not found.</div>;

  // Cart add logic: set the product to desired qty, no double-adding, always sync
  const onAdd = () => {
    // If already in cart, just set to desired qty (not add more)
    if (cartItem) {
      updateQty(product.id?.toString(), qty);
    } else {
      addToCart({
        _id: product.id?.toString(),
        name: product.name,
        price: product.price,
        quantity: qty,
        stock: product.stock,
        image: product.image,
      }, qty);
    }
    toast({
      duration: 1350,
      title: t("addedToCart"),
      description: <DopamineConfirm />,
      variant: "default"
    });
  };

  const handleBuyNow = () => {
    onAdd();
    setTimeout(() => {
      navigate("/cart");
    }, 250);
  };

  // Quantity zone
  const handleInc = () => {
    if (qty < stock) {
      setQty(qty + 1);
      // If already in cart, in-place update cart as well!
      if (cartItem) updateQty(product.id?.toString(), qty + 1);
    }
  };

  const handleDec = () => {
    if (qty > 1) {
      setQty(qty - 1);
      // If already in cart, keep it synced
      if (cartItem) updateQty(product.id?.toString(), qty - 1);
    } else if (qty === 1 && cartItem) {
      // Removing from cart, update UI
      removeFromCart(product.id?.toString());
      setQty(1);
      toast({
        duration: 1000,
        title: t("removedFromCart"),
        description: (
          <div className="flex items-center gap-2">
            <Minus size={16} className="inline text-red-600" />
            {t("removedFromCart")}
          </div>
        ),
        variant: "destructive"
      });
    }
  };

  // Add image zoom functionality
  const handleImgZoom = (e: React.MouseEvent) => {
    if (window.innerWidth > 600 && imgRef.current) {
      imgRef.current.classList.toggle("scale-105");
      imgRef.current.classList.toggle("ring-4");
      imgRef.current.classList.toggle("ring-lux-gold");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow p-6 animate-fade-in">
      <img
        ref={imgRef}
        src={product.image || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=700&q=80"} 
        alt={product.name}
        loading="lazy"
        className="w-full h-64 object-cover rounded mb-4 transition-transform duration-200 cursor-zoom-in hover:scale-105 hover:ring-4 hover:ring-lux-gold"
        onClick={handleImgZoom}
        tabIndex={0}
        aria-label={t("viewDetails")}
      />
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p className="text-gray-700 dark:text-gray-200 mb-4">{product.description}</p>
      <div className="flex items-center mb-4 gap-4">
        <span className="text-green-700 text-xl font-bold">₹{product.price}</span>
        <span className="text-xs bg-lux-gold/10 text-lux-gold border rounded-full px-3 py-1 ml-3">{product.category}</span>
        <span className="ml-6 text-sm text-gray-500">{t("stock", { count: product.stock })}</span>
      </div>
      <div className="flex items-center gap-4 my-4">
        {/* Quantity selector */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Decrease"
          onClick={handleDec}
          disabled={qty <= 1 && !cartItem}
          className="rounded-full"
          tabIndex={0}
        >
          <Minus size={22} />
        </Button>
        <span className="text-lg font-semibold px-3">{qty}</span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Increase"
          onClick={handleInc}
          disabled={qty >= stock}
          className="rounded-full"
          tabIndex={0}
        >
          <Plus size={22} />
        </Button>
      </div>
      <div className="flex gap-4">
        <Button
          onClick={onAdd}
          className="bg-green-500 text-white px-6 py-3 !rounded-lg hover:bg-green-600 transition flex gap-2 items-center text-lg font-semibold shadow"
          aria-label={t("addToCart")}
          tabIndex={0}
        >
          <ShoppingCart size={24} /> {t("addToCart")}
        </Button>
        <Button
          onClick={handleBuyNow}
          className="bg-lux-gold text-black px-6 py-3 !rounded-lg hover:bg-amber-400 transition flex gap-2 items-center text-lg font-bold shadow"
          aria-label={t("buyNow")}
          tabIndex={0}
        >
          {t("buyNow")} →
        </Button>
      </div>
      {/* Reviews */}
      <ProductReviews productId={product?.id?.toString()} />
    </div>
  );
};

export default ProductDetails;
