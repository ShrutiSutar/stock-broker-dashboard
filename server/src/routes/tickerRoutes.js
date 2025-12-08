const express = require("express");
const { SUPPORTED_TICKERS } = require("../tickers");
const { getPriceGenerator } = require("../priceGenerator");

const router = express.Router();

router.get("/tickers", (req, res) => {
  res.json({
    tickers: SUPPORTED_TICKERS,
    count: SUPPORTED_TICKERS.length,
  });
});

router.get("/prices", (req, res) => {
  const priceGenerator = getPriceGenerator();
  if (priceGenerator) {
    res.json(priceGenerator.getCurrentPrices());
  } else {
    res.status(503).json({ error: "Price generator not initialized" });
  }
});

module.exports = router;
