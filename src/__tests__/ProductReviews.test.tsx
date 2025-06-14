import { render, screen } from "@testing-library/react";
import ProductReviews from "../components/ProductReviews";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

describe("ProductReviews", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it("renders form and review list", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ProductReviews productId="test123" />
      </I18nextProvider>
    );
    expect(screen.getByText(/submit review/i)).toBeInTheDocument();
    expect(screen.getByText(/no reviews/i)).toBeInTheDocument();
  });
});
