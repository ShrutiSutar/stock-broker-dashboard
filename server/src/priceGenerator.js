const { SUPPORTED_TICKERS, INITIAL_PRICES } = require("./tickers");
const realPriceFetcher = require("./realPriceFetcher");

const VOLATILITY = parseFloat(process.env.VOLATILITY) || 0.002;
const UPDATE_INTERVAL_MS =
  parseInt(process.env.PRICE_UPDATE_INTERVAL_MS) || 1000;
const FETCH_REAL_PRICES_INTERVAL = 300000; // Fetch real prices every 5 minutes

class PriceGenerator {
  constructor() {
    this.prices = { ...INITIAL_PRICES };
    this.intervalId = null;
    this.realPriceIntervalId = null;
    this.usingRealPrices = false;
  }

  generateNewPrice(currentPrice) {
    // Geometric Brownian Motion (random walk) model
    // Adds realistic market volatility to real prices
    const changePercent = VOLATILITY * (Math.random() - 0.5);
    const changeAmount = currentPrice * changePercent;
    let newPrice = currentPrice + changeAmount;

    // Ensure price doesn't go below $0.01
    newPrice = Math.max(newPrice, 0.01);

    // Round to 2 decimal places
    return Math.round(newPrice * 100) / 100;
  }

  updateAllPrices() {
    const updated = {};
    for (const ticker of SUPPORTED_TICKERS) {
      this.prices[ticker] = this.generateNewPrice(this.prices[ticker]);
      updated[ticker] = this.prices[ticker];
    }
    return updated;
  }

  getCurrentPrices() {
    return { ...this.prices };
  }

  /**
   * Fetch real prices from external API and use them as base
   */
  async fetchAndUpdateRealPrices() {
    try {
      const realPrices = await realPriceFetcher.fetchRealPrices();
      // Update base prices with real market data
      for (const ticker of SUPPORTED_TICKERS) {
        if (realPrices[ticker]) {
          this.prices[ticker] = realPrices[ticker];
        }
      }
      this.usingRealPrices = true;
      console.log("✅ Real stock prices updated from market data");
    } catch (error) {
      console.log("⚠️ Using simulated prices (real price API unavailable)");
    }
  }

  start(io, userStore) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Fetch real prices on startup
    this.fetchAndUpdateRealPrices();

    // Periodic price updates
    this.intervalId = setInterval(() => {
      const updatedPrices = this.updateAllPrices();

      // Update user store with new prices
      for (const [ticker, price] of Object.entries(updatedPrices)) {
        userStore.updatePrice(ticker, price);

        // Send updates only to subscribed users
        const subscribedUsers = userStore.getUsersSubscribedTo(ticker);
        for (const user of subscribedUsers) {
          io.to(user.socketId).emit("priceUpdate", {
            [ticker]: price,
          });
        }
      }
    }, UPDATE_INTERVAL_MS);

    // Fetch real prices every 5 minutes to sync with market
    this.realPriceIntervalId = setInterval(() => {
      this.fetchAndUpdateRealPrices();
    }, FETCH_REAL_PRICES_INTERVAL);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

let priceGenerator = null;

function startPriceGenerator(io, userStore) {
  if (!priceGenerator) {
    priceGenerator = new PriceGenerator();
  }
  priceGenerator.start(io, userStore);
  return priceGenerator;
}

function getPriceGenerator() {
  return priceGenerator;
}

module.exports = { startPriceGenerator, getPriceGenerator, PriceGenerator };
