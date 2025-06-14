
import { useCartStore } from "@/store/cartStore";
import { formatWhatsappMessage } from "@/utils/formatWhatsapp";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
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

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = values => {
    const msg = formatWhatsappMessage(items, total, values);
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/91${whatsappNumber}?text=${encoded}`, "_blank");
    clearCart();
    navigate("/order-success");
  };

  if (!items.length) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded shadow p-7 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">{t("checkout")}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block font-semibold mb-1">{t("yourName")}</label>
          <input {...register("name")} className="w-full border rounded px-3 py-2 focus:border-green-500" />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>
        <div>
          <label className="block font-semibold mb-1">{t("phone") || t("phoneNumber") || "Phone Number"}</label>
          <input {...register("phone")} className="w-full border rounded px-3 py-2 focus:border-green-500" />
          {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
        </div>
        <div>
          <label className="block font-semibold mb-1">{t("deliveryAddress") || t("address") || "Delivery Address"}</label>
          <textarea {...register("address")} className="w-full border rounded px-3 py-2 min-h-24 focus:border-green-500" />
          {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 w-full mt-4 text-white py-2 rounded font-bold text-lg hover:bg-green-700 transition"
        >
          {t("checkout") + " via WhatsApp ⟶"}
        </button>
        <div className="text-gray-500 text-xs mt-2 text-center">
          {t("orderCheckoutHelp") || "Your order will open WhatsApp chat. No payment required now."}
        </div>
      </form>
    </div>
  );
};

export default Checkout;
