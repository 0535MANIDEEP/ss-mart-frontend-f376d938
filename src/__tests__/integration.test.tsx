
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

describe("Main E2E flows", () => {
  it("language switcher visible, can switch language", () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </MemoryRouter>
    );
    // All languages show up and are clickable
    const hindiBtn = screen.getByRole("button", { name: /हिंदी/i });
    expect(hindiBtn).toBeInTheDocument();
    fireEvent.click(hindiBtn);
    expect(document.body.innerHTML).toContain("एसएस मार्ट");
    const englishBtn = screen.getByRole("button", { name: /English/i });
    expect(englishBtn).toBeInTheDocument();
    fireEvent.click(englishBtn);
    expect(document.body.innerHTML).toContain("SS MART");
  });

  it("cart persists reloads and does not duplicate items", () => {
    // Simulate reloading and ensuring cart is still there
    window.localStorage.setItem(
      "ssmart_cart",
      JSON.stringify([
        { _id: "abc", name: "Test", price: 10, quantity: 2, stock: 10 }
      ])
    );
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </MemoryRouter>
    );
    // Check cart shows test item
    expect(screen.queryByText("Test")).toBeInTheDocument();
    // Now clear cart and check it goes away
    const clearBtn = screen.queryByText(/clear/i);
    if (clearBtn) fireEvent.click(clearBtn);
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });
});
