import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../components/Dashboard";
import * as api from "../services/api";

// Mock the useSocket hook
vi.mock("../hooks/useSocket", () => ({
  useSocket: () => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    syncSubscriptions: vi.fn(),
    isConnected: true,
    subscriptions: ["GOOG", "TSLA"],
    prices: {
      GOOG: 145.5,
      TSLA: 180.25,
      AMZN: 175.3,
      META: 485.75,
      NVDA: 950.0,
    },
  }),
}));

// Mock API calls
vi.mock("../services/api", () => ({
  getCurrentPrices: vi.fn(() =>
    Promise.resolve({
      GOOG: 145.5,
      TSLA: 180.25,
      AMZN: 175.3,
      META: 485.75,
      NVDA: 950.0,
    })
  ),
}));

describe("Dashboard", () => {
  const mockUser = {
    userId: "test123",
    email: "test@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dashboard title and connection status", async () => {
    render(<Dashboard user={mockUser} onLogout={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("Real-time Dashboard")).toBeInTheDocument();
    });

    expect(screen.getByText("Connected to live feed")).toBeInTheDocument();
  });

  it("displays all ticker cards", async () => {
    render(<Dashboard user={mockUser} onLogout={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("GOOG")).toBeInTheDocument();
      expect(screen.getByText("TSLA")).toBeInTheDocument();
      expect(screen.getByText("AMZN")).toBeInTheDocument();
      expect(screen.getByText("META")).toBeInTheDocument();
      expect(screen.getByText("NVDA")).toBeInTheDocument();
    });
  });

  it("shows subscription count", async () => {
    render(<Dashboard user={mockUser} onLogout={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("2 of 5 subscribed")).toBeInTheDocument();
    });
  });

  it("displays market overview table", async () => {
    render(<Dashboard user={mockUser} onLogout={vi.fn()} />);

    await waitFor(() => {
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      // Check table headers
      expect(screen.getByText("Ticker")).toBeInTheDocument();
      expect(screen.getByText("Price")).toBeInTheDocument();
      expect(screen.getByText("Change")).toBeInTheDocument();
      expect(screen.getByText("% Change")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
    });
  });

  it("shows user information", async () => {
    render(<Dashboard user={mockUser} onLogout={vi.fn()} />);

    await waitFor(() => {
      expect(
        screen.getByText(`Welcome, ${mockUser.email}`)
      ).toBeInTheDocument();
    });
  });
});
