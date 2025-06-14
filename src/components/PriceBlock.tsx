
import { useTranslation } from "react-i18next";

type PriceBlockProps = {
  price: number;
  category: string;
  stock: number;
};

export default function PriceBlock({ price, category, stock }: PriceBlockProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center mb-4 gap-4">
      <span className="text-green-700 text-xl font-bold">₹{price}</span>
      <span className="text-xs bg-lux-gold/10 text-lux-gold border rounded-full px-3 py-1 ml-3">{category}</span>
      <span className="ml-6 text-sm text-gray-500">{t("stock", { count: stock })}</span>
    </div>
  );
}
