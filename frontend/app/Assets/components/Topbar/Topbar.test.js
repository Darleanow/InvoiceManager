// Topbar.test.js

import { render, screen } from "@testing-library/react";
import Topbar from "./Topbar";
import "@testing-library/jest-dom/extend-expect";

describe("Topbar Component", () => {
  beforeEach(() => {
    render(<Topbar />);
  });

  test("renders the logo text", () => {
    const logoText = screen.getByTestId("logo_text");
    expect(logoText).toBeInTheDocument();
    expect(logoText).toHaveTextContent("InMa");
  });

  test("renders the username text", () => {
    const usernameText = screen.getByTestId("username_text");
    expect(usernameText).toBeInTheDocument();
    expect(usernameText).toHaveTextContent("Username");
  });

  test("renders the search input", () => {
    const searchInput = screen.getByTestId("search_input");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("placeholder", "Search");
  });

  test("renders the notifications icon", () => {
    const notificationsIcon = screen.getByTestId("notifications_icon");
    expect(notificationsIcon).toBeInTheDocument();
  });

  test("renders the settings icon", () => {
    const settingsIcon = screen.getByTestId("settings_icon");
    expect(settingsIcon).toBeInTheDocument();
  });

  test("renders the create invoice button", () => {
    const createInvoiceButton = screen.getByTestId("create_invoice_button");
    expect(createInvoiceButton).toBeInTheDocument();
    expect(createInvoiceButton).toHaveTextContent("Create Invoice");
  });
});
