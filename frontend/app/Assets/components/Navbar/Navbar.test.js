import { render, screen } from "@testing-library/react";
import Navbar from "./navbar";
import "@testing-library/jest-dom";

describe("Navbar Component", () => {
  test("renders navbar items", () => {
    render(<Navbar />);
    const billingItem = screen.getByText(/billing/i); 
    const clientsItem = screen.getByText(/clients/i);
    const reportingItem = screen.getByText(/reporting/i);

    expect(billingItem).toBeInTheDocument(); 
    expect(clientsItem).toBeInTheDocument(); 
    expect(reportingItem).toBeInTheDocument(); 
  });
});
