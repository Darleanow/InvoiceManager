import { render, screen, fireEvent } from "@testing-library/react"; 
import SubNavigationBilling from "./SubNavigationBilling"; 
import "@testing-library/jest-dom"; 

describe("SubNavigationBilling Component", () => {
  
  // Run this setup code before each test
  beforeEach(() => {
    render(<SubNavigationBilling />); 
  });

  test("renders the billing title", () => {
    const titleElement = screen.getByText(/billing/i);
    // Check that the billing title is in the document
    expect(titleElement).toBeInTheDocument(); 
  });

  test("renders sub-navigation items", () => {
    const overviewItem = screen.getByText(/overview/i); 
    const quotationItem = screen.getByText(/quotation/i);
    // Get the sub-navigation item 'Invoice'
    const invoiceItem = screen.getByText(/invoice/i); 

    // Check that each sub-navigation item is in the document
    expect(overviewItem).toBeInTheDocument();
    expect(quotationItem).toBeInTheDocument();
    expect(invoiceItem).toBeInTheDocument();
  });

  // Test to check if the active sub-navigation changes on click
  test("changes active sub-navigation on click", () => {
    const overviewItem = screen.getByText(/overview/i); 
    const quotationItem = screen.getByText(/quotation/i); 
    // Get the sub-navigation item 'Invoice'
    const invoiceItem = screen.getByText(/invoice/i); 

    fireEvent.click(quotationItem); // Simulate a click on the 'Quotation' item
    expect(quotationItem).toHaveClass("billing_subnav_item_active"); 
    expect(overviewItem).not.toHaveClass("billing_subnav_item_active"); 
    // Check that the 'Invoice' item does not have the active class
    expect(invoiceItem).not.toHaveClass("billing_subnav_item_active"); 

    fireEvent.click(invoiceItem); // Simulate a click on the 'Invoice' item
    expect(invoiceItem).toHaveClass("billing_subnav_item_active"); 
    expect(overviewItem).not.toHaveClass("billing_subnav_item_active"); 
    // Check that the 'Quotation' item does not have the active class
    expect(quotationItem).not.toHaveClass("billing_subnav_item_active"); 
  });

  // Test to check if an alert is shown on export button click
  test("alerts on export button click", () => {
    const exportButton = screen.getByText(/export/i); 
    // Mock the alert function
    global.alert = jest.fn(); 

    // Simulate a click on the export button
    fireEvent.click(exportButton); 
    
    // Check that the alert function was called with the expected message
    expect(global.alert).toHaveBeenCalledWith("T'exporte rien");
  });
});
