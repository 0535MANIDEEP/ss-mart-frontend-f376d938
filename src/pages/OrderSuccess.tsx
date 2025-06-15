
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DownloadOrderPDF from "@/components/DownloadOrderPDF";

// Replace the demoOrder below with REAL order data in production!
// For demo/testing: create a fake order. In a real app, fetch it from server/localState.
const demoOrder = {
  id: "ORDER123",
  user_id: "USER456",
  created_at: new Date().toISOString(),
  items: [
    { product_id: "PROD001", name: "Surf Excel 1kg", qty: 2, price: 120 },
    { product_id: "PROD002", name: "Colgate Toothpaste", qty: 1, price: 55 },
  ],
  total_amount: 295,
};

const OrderSuccess = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fade-in px-2 sm:px-0">
      <h2 className="text-2xl font-bold text-green-600 mb-2 text-center">{t("orderSent")}</h2>
      <p className="mb-4 text-gray-700 text-center">{t("orderSentMsg")}</p>
      <Link to="/" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition w-full max-w-xs text-center">
        {t("continueShopping")}
      </Link>
      {/* PDF Download invoice */}
      <div className="mt-4">
        <DownloadOrderPDF order={demoOrder} />
      </div>
    </div>
  );
};

export default OrderSuccess;

