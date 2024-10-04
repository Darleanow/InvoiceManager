import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";
import "@testing-library/jest-dom/extend-expect";

describe("Navbar Component", () => {
  beforeEach(() => {
    render(<Navbar />);
  });

  test("renders navbar items", () => {
    const billingItem = screen.getByText(/billing/i);
    const clientsItem = screen.getByText(/clients/i);
    const reportingItem = screen.getByText(/reporting/i);

    expect(billingItem).toBeInTheDocument();
    expect(clientsItem).toBeInTheDocument();
    expect(reportingItem).toBeInTheDocument();
  });

  test("sets active nav item on click", () => {
    const billingButton = screen.getByText(/billing/i);
    const clientsButton = screen.getByText(/clients/i);
    const reportingButton = screen.getByText(/reporting/i);

    // Click on 'Clients'
    fireEvent.click(clientsButton);
    expect(clientsButton.parentElement.firstChild).toHaveClass("active");
    expect(billingButton.parentElement.firstChild).not.toHaveClass("active");
    expect(reportingButton.parentElement.firstChild).not.toHaveClass("active");

    // Click on 'Reporting'
    fireEvent.click(reportingButton);
    expect(reportingButton.parentElement.firstChild).toHaveClass("active");
    expect(billingButton.parentElement.firstChild).not.toHaveClass("active");
    expect(clientsButton.parentElement.firstChild).not.toHaveClass("active");
  });

  test("sets billing as the initial active nav item", () => {
    const billingButton = screen.getByText(/billing/i);
    expect(billingButton.parentElement.firstChild).toHaveClass("active");
  });
});
