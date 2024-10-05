import { render, screen } from "@testing-library/react";
import Navbar from "./navbar";
import "@testing-library/jest-dom";

describe("Navbar Component", () => {
  test("renders navbar items", () => {
    render(<Navbar />);
    const billingItem = screen.getByText(/billing/i); 
    const clientsItem = screen.getByText(/clients/i);
    const reportingItem = screen.getByText(/reporting/i);

    // Check if the billing item is in the DOM
    expect(billingItem).toBeInTheDocument(); 
    // Check if the clients item is in the DOM
    expect(clientsItem).toBeInTheDocument(); 
    // Check if the reporting item is in the DOM
    expect(reportingItem).toBeInTheDocument(); 
  });
});
