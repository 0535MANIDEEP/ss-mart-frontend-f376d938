
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OrderSuccess = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fade-in">
      <h2 className="text-2xl font-bold text-green-600 mb-2">{t("orderSent")}</h2>
      <p className="mb-4 text-gray-700">{t("orderSentMsg")}</p>
      <Link to="/" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
        {t("continueShopping")}
      </Link>
    </div>
  );
};

export default OrderSuccess;
