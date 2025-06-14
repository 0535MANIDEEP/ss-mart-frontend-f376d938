
import { useTranslation } from "react-i18next";
import ProductReviews from "./ProductReviews";

type ReviewSectionProps = {
  role: string;
  productId?: string;
};

export default function ReviewSection({ role, productId }: ReviewSectionProps) {
  const { t } = useTranslation();
  if (role === "guest") {
    return (
      <div className="my-6 text-gray-500 bg-yellow-50 border-l-4 border-yellow-300 py-2 px-4 rounded" tabIndex={0}>
        {t("login")} to leave a review.
      </div>
    );
  }
  return <ProductReviews productId={productId} />;
}
