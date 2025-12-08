const { PriceGenerator } = require("../priceGenerator");

describe("PriceGenerator", () => {
  let priceGenerator;

  beforeEach(() => {
    priceGenerator = new PriceGenerator();
  });

  test("should generate new price within reasonable range", () => {
    const initialPrice = 100;
    const newPrice = priceGenerator.generateNewPrice(initialPrice);

    // Price should not be negative
    expect(newPrice).toBeGreaterThan(0);

    // Price should change but not drastically (within 20% for volatility 0.002)
    const percentChange = Math.abs(newPrice - initialPrice) / initialPrice;
    expect(percentChange).toBeLessThan(0.2);
  });

  test("should update all prices", () => {
    const initialPrices = { ...priceGenerator.prices };
    const updatedPrices = priceGenerator.updateAllPrices();

    // All tickers should be updated
    expect(Object.keys(updatedPrices)).toHaveLength(5);

    // Prices should be different
    for (const ticker of Object.keys(updatedPrices)) {
      expect(updatedPrices[ticker]).not.toBe(initialPrices[ticker]);
    }
  });

  test("should start and stop interval", () => {
    const mockIo = { to: jest.fn(() => ({ emit: jest.fn() })) };
    const mockUserStore = {
      updatePrice: jest.fn(),
      getUsersSubscribedTo: jest.fn(() => []),
    };

    priceGenerator.start(mockIo, mockUserStore);
    expect(priceGenerator.intervalId).toBeDefined();

    priceGenerator.stop();
    expect(priceGenerator.intervalId).toBeNull();
  });
});
