import { render, screen, fireEvent } from "@testing-library/react";
import SubNavigationBilling from "./SubNavigationBilling";
import "@testing-library/jest-dom/extend-expect";

describe("SubNavigationBilling Component", () => {
  beforeEach(() => {
    render(<SubNavigationBilling />);
  });

  test("renders the billing title", () => {
    const titleElement = screen.getByText(/billing/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("renders sub-navigation items", () => {
    const overviewItem = screen.getByText(/overview/i);
    const quotationItem = screen.getByText(/quotation/i);
    const invoiceItem = screen.getByText(/invoice/i);

    expect(overviewItem).toBeInTheDocument();
    expect(quotationItem).toBeInTheDocument();
    expect(invoiceItem).toBeInTheDocument();
  });

  test("changes active sub-navigation on click", () => {
    const overviewItem = screen.getByText(/overview/i);
    const quotationItem = screen.getByText(/quotation/i);
    const invoiceItem = screen.getByText(/invoice/i);

    // Click on 'Quotation'
    fireEvent.click(quotationItem);
    expect(quotationItem).toHaveClass("billing_subnav_item_active");
    expect(overviewItem).not.toHaveClass("billing_subnav_item_active");
    expect(invoiceItem).not.toHaveClass("billing_subnav_item_active");

    // Click on 'Invoice'
    fireEvent.click(invoiceItem);
    expect(invoiceItem).toHaveClass("billing_subnav_item_active");
    expect(overviewItem).not.toHaveClass("billing_subnav_item_active");
    expect(quotationItem).not.toHaveClass("billing_subnav_item_active");
  });

  test("alerts on export button click", () => {
    const exportButton = screen.getByText(/export/i);
    global.alert = jest.fn(); // Mock the alert function

    fireEvent.click(exportButton);
    
    expect(global.alert).toHaveBeenCalledWith("T'exporte rien");
  });
});
