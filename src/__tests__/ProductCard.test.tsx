
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "../components/product/ProductCard";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { useCartStore } from "../store/cartStore";

// Mock product
const mockProduct = {
  id: "123",
  name: { en: "Test Product" },
  description: { en: "Product Description" },
  price: 45,
  stock: 5,
  image_url: null,
  category: "Groceries"
};

jest.mock("../store/cartStore", () => {
  const actual = jest.requireActual("../store/cartStore");
  return {
    ...actual,
    useCartStore: jest.fn(actual.useCartStore)
  };
});

describe("ProductCard", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("renders product details", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ProductCard product={mockProduct} />
      </I18nextProvider>
    );
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
    expect(screen.getByText(/₹45/i)).toBeInTheDocument();
  });

  it("adds product to cart when Add to Cart is clicked", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ProductCard product={mockProduct} />
      </I18nextProvider>
    );
    fireEvent.click(screen.getByText(/Add to Cart/i));
    const items = useCartStore.getState().items;
    expect(items.find(i => i._id === "123")).toBeTruthy();
  });
});

