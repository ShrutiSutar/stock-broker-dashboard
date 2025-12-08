const axios = require("axios");
const { SUPPORTED_TICKERS, INITIAL_PRICES } = require("./tickers");

class RealPriceFetcher {
  constructor() {
    this.cache = { ...INITIAL_PRICES };
    this.lastFetch = {};
    this.cacheTimeout = 60000; // 1 minute cache
    // Using Finnhub API (free tier: 60 requests/min)
    this.apiKey = process.env.FINNHUB_API_KEY || "demo"; // For demo, uses sample data
  }

  /**
   * Fetch real stock prices from Finnhub API
   * Free tier: 60 API calls per minute
   */
  async fetchRealPrices() {
    try {
      const prices = { ...this.cache };
      const now = Date.now();

      // Batch fetch tickers that haven't been fetched recently
      const tickersToFetch = SUPPORTED_TICKERS.filter(
        (ticker) =>
          !this.lastFetch[ticker] ||
          now - this.lastFetch[ticker] > this.cacheTimeout
      );

      if (tickersToFetch.length === 0) {
        return this.cache;
      }

      // Fetch in small batches to respect API limits
      for (const ticker of tickersToFetch.slice(0, 10)) {
        try {
          const price = await this.fetchSinglePrice(ticker);
          if (price) {
            prices[ticker] = price;
            this.cache[ticker] = price;
            this.lastFetch[ticker] = now;
          }
        } catch (error) {
          console.log(`Failed to fetch ${ticker}, using cached price`);
        }
      }

      return prices;
    } catch (error) {
      console.error("Error fetching real prices:", error.message);
      return this.cache;
    }
  }

  /**
   * Fetch single stock price using Finnhub API
   */
  async fetchSinglePrice(ticker) {
    try {
      // Using Finnhub API (free tier available)
      const response = await axios.get("https://finnhub.io/api/v1/quote", {
        params: {
          symbol: ticker,
          token: this.apiKey,
        },
        timeout: 5000,
      });

      if (response.data && response.data.c) {
        return parseFloat(response.data.c);
      }
      return null;
    } catch (error) {
      // Fallback: Use cached price if API fails
      if (this.cache[ticker]) {
        return this.cache[ticker];
      }
      return null;
    }
  }

  /**
   * Alternative: Fetch from Yahoo Finance using unofficial API
   */
  async fetchFromYahoo(ticker) {
    try {
      const response = await axios.get(
        `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}`,
        {
          params: {
            modules: "price",
          },
          timeout: 5000,
        }
      );

      const price =
        response.data?.quoteSummary?.result?.[0]?.price?.regularMarketPrice
          ?.raw;
      if (price) {
        return parseFloat(price);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Simulate realistic price movements from base price
   * Uses the real price as a starting point and applies small random variations
   */
  generateRealisticPrice(basePrice) {
    // Small random variation (±0.5% to ±2%)
    const variation = (Math.random() - 0.5) * 0.04;
    const newPrice = basePrice * (1 + variation);
    return Math.max(Math.round(newPrice * 100) / 100, 0.01);
  }

  /**
   * Get current cached prices
   */
  getCachedPrices() {
    return { ...this.cache };
  }

  /**
   * Update cache with new prices
   */
  updateCache(ticker, price) {
    this.cache[ticker] = price;
  }
}

module.exports = new RealPriceFetcher();
