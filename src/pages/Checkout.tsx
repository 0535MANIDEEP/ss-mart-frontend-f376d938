
import { useCartStore } from "@/store/cartStore";
import { formatWhatsappMessage } from "@/utils/formatWhatsapp";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "9849530828";

const Checkout = () => {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    name: yup.string().required(t("required")),
    phone: yup.string().required(t("required")).matches(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    address: yup.string().required(t("required")).min(8),
  });

  const items = useCartStore(state => state.items);
  const clearCart = useCartStore(state => state.clearCart);
  const total = items.reduce((s, i) => s + (i.price * i.quantity), 0);
  const navigate = useNavigate();
  const location = useLocation();

  let checkoutItems = items;
  let singleTotal = total;
  if (location.state && location.state.buyNow) {
    const buyNowProduct = location.state.buyNow;
    checkoutItems = [{
      ...buyNowProduct,
      _id: buyNowProduct.id.toString(),
      quantity: buyNowProduct.quantity ?? 1,
      name: buyNowProduct.name,
      price: buyNowProduct.price,
      stock: buyNowProduct.stock,
      image: buyNowProduct.image,
    }];
    singleTotal = buyNowProduct.price * (buyNowProduct.quantity ?? 1);
  }

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = values => {
    const msg = formatWhatsappMessage(checkoutItems, singleTotal, values);
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/91${whatsappNumber}?text=${encoded}`, "_blank");
    clearCart();
    navigate("/order-success");
  };

  if (!checkoutItems.length) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white dark:bg-lux-black rounded-lg shadow p-7 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">{t("checkout")}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block font-semibold mb-1 text-primary dark:text-lux-gold">{t("yourName")}</label>
          <input {...register("name")} className="w-full border rounded px-3 py-2 min-h-[44px] focus:border-green-500 bg-white dark:bg-neutral-900 text-black dark:text-white" style={{ borderRadius: 8 }} />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>
        <div>
          <label className="block font-semibold mb-1 text-primary dark:text-lux-gold">{t("phone") || t("phoneNumber") || "Phone Number"}</label>
          <input {...register("phone")} className="w-full border rounded px-3 py-2 min-h-[44px] focus:border-green-500 bg-white dark:bg-neutral-900 text-black dark:text-white" style={{ borderRadius: 8 }} />
          {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
        </div>
        <div>
          <label className="block font-semibold mb-1 text-primary dark:text-lux-gold">{t("deliveryAddress") || t("address") || "Delivery Address"}</label>
          <textarea {...register("address")} className="w-full border rounded px-3 py-2 min-h-24 focus:border-green-500 bg-white dark:bg-neutral-900 text-black dark:text-white" style={{ borderRadius: 8 }} />
          {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 dark:bg-green-700 w-full mt-4 text-white py-2 min-h-[44px] rounded-lg font-bold text-lg hover:bg-green-700 dark:hover:bg-green-900 transition"
          style={{ borderRadius: 8 }}
        >
          {t("checkout") + " via WhatsApp ⟶"}
        </button>
        <div className="text-gray-500 text-xs mt-2 text-center dark:text-gray-400">
          {t("orderCheckoutHelp") || "Your order will open WhatsApp chat. No payment required now."}
        </div>
      </form>
    </div>
  );
};

export default Checkout;
