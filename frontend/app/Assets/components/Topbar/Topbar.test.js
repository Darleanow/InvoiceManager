import { render, screen } from "@testing-library/react"; 
import Topbar from "./Topbar"; 
import "@testing-library/jest-dom"; 


describe("Topbar Component", () => {
  
  
  beforeEach(() => {
    render(<Topbar />); 
  });

  test("renders the logo text", () => {
    const logoText = screen.getByTestId("logo_text"); // Get the logo text element 
    expect(logoText).toBeInTheDocument(); // Assert that the logo text is in the document
    expect(logoText).toHaveTextContent("InMa"); // Assert that the logo text has the expected content
  });

  test("renders the username text", () => {
    const usernameText = screen.getByTestId("username_text"); // Get the username text element 
    expect(usernameText).toBeInTheDocument(); // Assert that the username text is in the document
    expect(usernameText).toHaveTextContent("Username"); // Assert that the username text has the expected content
  });

  test("renders the search input", () => {
    const searchInput = screen.getByTestId("search_input"); // Get the search input element 
    expect(searchInput).toBeInTheDocument(); // Assert that the search input is in the document
    expect(searchInput).toHaveAttribute("placeholder", "Search"); // Assert that the search input has the correct placeholder text
  });

  
  test("renders the notifications icon", () => {
    const notificationsIcon = screen.getByTestId("notifications_icon"); // Get the notifications icon
    expect(notificationsIcon).toBeInTheDocument(); // Assert that the notifications icon is in the document
  });

  
  test("renders the settings icon", () => {
    const settingsIcon = screen.getByTestId("settings_icon"); // Get the settings icon 
    expect(settingsIcon).toBeInTheDocument(); // Assert that the settings icon is in the document
  });

  
  test("renders the create invoice button", () => {
    const createInvoiceButton = screen.getByTestId("create_invoice_button"); // Get the create invoice button 
    expect(createInvoiceButton).toBeInTheDocument(); // Assert that the create invoice button is in the document
    expect(createInvoiceButton).toHaveTextContent("Create Invoice"); // Assert that the button has the expected text content
  });
});
