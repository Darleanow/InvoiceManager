import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";
import "@testing-library/jest-dom";
import punycode from 'punycode';

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
