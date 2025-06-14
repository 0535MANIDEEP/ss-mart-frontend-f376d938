
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
    const hindiBtn = screen.getByRole("button", { name: /हिंदी/i });
    fireEvent.click(hindiBtn);
    expect(document.body.innerHTML).toContain("एसएस मार्ट");
  });
});
