import { render, screen } from "@testing-library/react"; 
import Topbar from "./Topbar"; 
import "@testing-library/jest-dom"; 


describe("Topbar Component", () => {
  
  
  beforeEach(() => {
    render(<Topbar />); 
  });

  test("renders the logo text", () => {
    const logoText = screen.getByTestId("logo_text"); 
    // Assert that the logo text is in the document
    expect(logoText).toBeInTheDocument(); 
    // Assert that the logo text has the expected content
    expect(logoText).toHaveTextContent("InMa"); 
  });

  test("renders the username text", () => {
    const usernameText = screen.getByTestId("username_text"); 
    // Assert that the username text is in the document
    expect(usernameText).toBeInTheDocument(); 
    // Assert that the username text has the expected content
    expect(usernameText).toHaveTextContent("Username"); 
  });

  test("renders the search input", () => {
    // Get the search input element
    const searchInput = screen.getByTestId("search_input"); 
    // Assert that the search input is in the document 
    expect(searchInput).toBeInTheDocument(); 
    // Assert that the search input has the correct placeholder text
    expect(searchInput).toHaveAttribute("placeholder", "Search"); 
  });

  
  test("renders the notifications icon", () => {
    const notificationsIcon = screen.getByTestId("notifications_icon"); 
    // Assert that the notifications icon is in the document
    expect(notificationsIcon).toBeInTheDocument(); 
  });

  
  test("renders the settings icon", () => {
    // Get the settings icon 
    const settingsIcon = screen.getByTestId("settings_icon"); 
    // Assert that the settings icon is in the document
    expect(settingsIcon).toBeInTheDocument(); 
  });

  
  test("renders the create invoice button", () => {
    const createInvoiceButton = screen.getByTestId("create_invoice_button"); 
    // Assert that the create invoice button is in the document
    expect(createInvoiceButton).toBeInTheDocument(); 
    // Assert that the button has the expected text content
    expect(createInvoiceButton).toHaveTextContent("Create Invoice"); 
  });
});
