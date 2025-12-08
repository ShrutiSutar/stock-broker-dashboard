// Top 10 most popular stocks for the dashboard
const SUPPORTED_TICKERS = [
  "GOOG", // Google/Alphabet
  "MSFT", // Microsoft
  "AAPL", // Apple
  "AMZN", // Amazon
  "NVDA", // NVIDIA
  "META", // Meta/Facebook
  "TSLA", // Tesla
  "NFLX", // Netflix
  "JPM", // JPMorgan Chase
  "BRK.B", // Berkshire Hathaway
];

const TICKER_INFO = {
  GOOG: { name: "Alphabet Inc.", sector: "Technology" },
  MSFT: { name: "Microsoft Corp.", sector: "Technology" },
  AAPL: { name: "Apple Inc.", sector: "Technology" },
  AMZN: { name: "Amazon.com Inc.", sector: "Technology" },
  NVDA: { name: "NVIDIA Corp.", sector: "Semiconductors" },
  META: { name: "Meta Platforms Inc.", sector: "Technology" },
  TSLA: { name: "Tesla Inc.", sector: "Automotive" },
  NFLX: { name: "Netflix Inc.", sector: "Entertainment" },
  JPM: { name: "JPMorgan Chase", sector: "Finance" },
  "BRK.B": { name: "Berkshire Hathaway B", sector: "Finance" },
};

// Default initial prices (fallback if API fails)
const INITIAL_PRICES = {
  GOOG: 145.5,
  MSFT: 420.0,
  AAPL: 235.0,
  AMZN: 175.3,
  NVDA: 950.0,
  META: 485.75,
  TSLA: 180.25,
  NFLX: 280.0,
  JPM: 190.0,
  "BRK.B": 425.0,
};

module.exports = { SUPPORTED_TICKERS, INITIAL_PRICES, TICKER_INFO };
