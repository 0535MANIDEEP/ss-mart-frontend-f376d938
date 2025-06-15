
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
      <span className="text-ssblue-primary text-xl font-bold">₹{price}</span>
      <span className="text-xs bg-ssblue-card text-ssblue-primary border border-ssblue-secondary rounded-full px-3 py-1 ml-3">{category}</span>
      <span className="ml-6 text-sm text-gray-500">{t("stock", { count: stock })}</span>
    </div>
  );
}
