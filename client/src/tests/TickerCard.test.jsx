import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TickerCard from "../components/TickerCard";

describe("TickerCard", () => {
  const mockProps = {
    ticker: "GOOG",
    price: 145.5,
    previousPrice: 144.5,
    isSubscribed: false,
    onToggleSubscribe: vi.fn(),
    priceChange: 1.0,
    priceChangePercent: 0.69,
  };

  it("renders ticker symbol and name", () => {
    render(<TickerCard {...mockProps} />);

    expect(screen.getByText("GOOG")).toBeInTheDocument();
    expect(screen.getByText("Alphabet Inc.")).toBeInTheDocument();
  });

  it("displays price correctly", () => {
    render(<TickerCard {...mockProps} />);

    expect(screen.getByText("$145.50")).toBeInTheDocument();
  });

  it("shows price change indicator", () => {
    render(<TickerCard {...mockProps} />);

    expect(screen.getByText("+1.00")).toBeInTheDocument();
    expect(screen.getByText("(+0.69%)")).toBeInTheDocument();
  });

  it("calls onToggleSubscribe when button is clicked", () => {
    render(<TickerCard {...mockProps} />);

    const subscribeButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(subscribeButton);

    expect(mockProps.onToggleSubscribe).toHaveBeenCalledTimes(1);
  });

  it("shows subscribed state correctly", () => {
    const subscribedProps = { ...mockProps, isSubscribed: true };
    render(<TickerCard {...subscribedProps} />);

    expect(screen.getByText("Subscribed")).toBeInTheDocument();
    expect(screen.getByText("Receiving updates")).toBeInTheDocument();
  });

  it("handles negative price change", () => {
    const negativeProps = {
      ...mockProps,
      price: 144.5,
      previousPrice: 145.5,
      priceChange: -1.0,
      priceChangePercent: -0.69,
    };

    render(<TickerCard {...negativeProps} />);

    expect(screen.getByText("-1.00")).toBeInTheDocument();
    expect(screen.getByText("(-0.69%)")).toBeInTheDocument();
  });
});
