
import React from "react";
import { useTranslation } from "react-i18next";

// Display a horizontal row of category filter chips
interface CategoryOption {
  label: string;
  value: string;
}
interface Props {
  category: string;
  setCategory: (c: string) => void;
  categories?: CategoryOption[];
}

const DEFAULT_CATEGORIES = [
  { label: "All", value: "All" },
  { label: "Groceries", value: "Groceries" },
  { label: "Personal Care", value: "Personal Care" },
  { label: "Beverages", value: "Beverages" },
  { label: "Snacks", value: "Snacks" },
  { label: "Household", value: "Household" },
  { label: "Others", value: "Others" },
];

const CategoryFilter: React.FC<Props> = ({
  category,
  setCategory,
  categories,
}) => {
  const { t } = useTranslation();
  const localCategories =
    categories ||
    DEFAULT_CATEGORIES.map((c) => ({
      ...c,
      label: t(
        c.value === "All"
          ? "all"
          : c.value === "Groceries"
          ? "categories.groceries"
          : c.value === "Personal Care"
          ? "categories.personalCare"
          : c.value === "Beverages"
          ? "categories.beverages"
          : c.value === "Snacks"
          ? "categories.snacks"
          : c.value === "Household"
          ? "categories.household"
          : c.value === "Others"
          ? "categories.others"
          : c.value
      ) || c.value,
    }));

  return (
    <nav
      className="flex flex-nowrap overflow-x-auto gap-2 py-2 px-1 max-w-full justify-center"
      aria-label={t("categories") || "Product Categories"}
      role="tablist"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {localCategories.map((cat) => (
        <button
          className={`lux-category-btn${cat.value === category ? " active" : ""}`}
          key={cat.value}
          onClick={() => setCategory(cat.value)}
          aria-label={`Show ${cat.label} products`}
          aria-selected={cat.value === category}
          tabIndex={0}
          type="button"
          role="tab"
        >
          {cat.label}
        </button>
      ))}
    </nav>
  );
};

export default CategoryFilter;
