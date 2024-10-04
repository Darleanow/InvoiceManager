import { render, screen, fireEvent } from "@testing-library/react"; 
import SubNavigationBilling from "./SubNavigationBilling"; 
import "@testing-library/jest-dom"; 

describe("SubNavigationBilling Component", () => {
  
  // Run this setup code before each test
  beforeEach(() => {
    render(<SubNavigationBilling />); 
  });

  test("renders the billing title", () => {
    const titleElement = screen.getByText(/billing/i); // Get the billing title element 
    expect(titleElement).toBeInTheDocument(); // Check that the billing title is in the document
  });

  test("renders sub-navigation items", () => {
    const overviewItem = screen.getByText(/overview/i); // Get the sub-navigation item 'Overview'
    const quotationItem = screen.getByText(/quotation/i); // Get the sub-navigation item 'Quotation'
    const invoiceItem = screen.getByText(/invoice/i); // Get the sub-navigation item 'Invoice'

    // Check that each sub-navigation item is in the document
    expect(overviewItem).toBeInTheDocument();
    expect(quotationItem).toBeInTheDocument();
    expect(invoiceItem).toBeInTheDocument();
  });

  // Test to check if the active sub-navigation changes on click
  test("changes active sub-navigation on click", () => {
    const overviewItem = screen.getByText(/overview/i); // Get the sub-navigation item 'Overview'
    const quotationItem = screen.getByText(/quotation/i); // Get the sub-navigation item 'Quotation'
    const invoiceItem = screen.getByText(/invoice/i); // Get the sub-navigation item 'Invoice'

    fireEvent.click(quotationItem); // Simulate a click on the 'Quotation' item
    expect(quotationItem).toHaveClass("billing_subnav_item_active"); // Check that the 'Quotation' item has the active class
    expect(overviewItem).not.toHaveClass("billing_subnav_item_active"); // Check that the 'Overview' item does not have the active class
    expect(invoiceItem).not.toHaveClass("billing_subnav_item_active"); // Check that the 'Invoice' item does not have the active class

    fireEvent.click(invoiceItem); // Simulate a click on the 'Invoice' item
    expect(invoiceItem).toHaveClass("billing_subnav_item_active"); // Check that the 'Invoice' item has the active class
    expect(overviewItem).not.toHaveClass("billing_subnav_item_active"); // Check that the 'Overview' item does not have the active class
    expect(quotationItem).not.toHaveClass("billing_subnav_item_active"); // Check that the 'Quotation' item does not have the active class
  });

  // Test to check if an alert is shown on export button click
  test("alerts on export button click", () => {
    const exportButton = screen.getByText(/export/i); // Get the export button element 
    global.alert = jest.fn(); // Mock the alert function

    fireEvent.click(exportButton); // Simulate a click on the export button
    
    // Check that the alert function was called with the expected message
    expect(global.alert).toHaveBeenCalledWith("T'exporte rien");
  });
});
