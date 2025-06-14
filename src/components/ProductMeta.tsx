
import ProductImage from "./ProductImage";
import { useTranslation } from "react-i18next";

type MultiLang = { en: string; hi?: string; te?: string };
type ProductMetaProps = {
  product: {
    name: MultiLang | string;
    description: MultiLang | string;
    image: string;
    id?: string | number;
  };
  lang: string;
};

function getProductField(
  data: MultiLang | string | undefined,
  lang: string,
  fallback: string = ""
): string {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  return data[lang as keyof MultiLang] || data.en || fallback;
}

export default function ProductMeta({ product, lang }: ProductMetaProps) {
  const { t } = useTranslation();
  const name = getProductField(product.name, lang, t("noDescription") || "No desc");
  const desc = getProductField(product.description, lang, t("noDescription") || "No desc");

  return (
    <>
      <ProductImage src={product.image} alt={name} size="large" className="mb-4" />
      <h2 className="text-2xl font-bold mb-2 truncate">{name}</h2>
      <p className="text-gray-700 dark:text-gray-200 mb-4 whitespace-pre-line break-words">{desc}</p>
    </>
  );
}
