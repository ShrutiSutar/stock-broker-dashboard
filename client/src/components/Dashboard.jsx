import { useState, useEffect, useCallback, useMemo } from "react";
import TickerCard from "./TickerCard";
import PriceChart from "./PriceChart";
import PriceAlerts from "./PriceAlerts";
import AdvancedAnalytics from "./AdvancedAnalytics";
import Watchlist from "./Watchlist";
import ExportData from "./ExportData";
import { useSocket } from "../hooks/useSocket";

// Top 10 most popular stocks
const SUPPORTED_TICKERS = [
  "GOOG",
  "MSFT",
  "AAPL",
  "AMZN",
  "NVDA",
  "META",
  "TSLA",
  "NFLX",
  "JPM",
  "BRK.B",
];

const TICKER_SECTORS = {
  GOOG: "Technology",
  MSFT: "Technology",
  AAPL: "Technology",
  AMZN: "Technology",
  NVDA: "Semiconductors",
  META: "Technology",
  TSLA: "Automotive",
  NFLX: "Entertainment",
  JPM: "Finance",
  "BRK.B": "Finance",
};

const Dashboard = ({ user, onLogout }) => {
  const [previousPrices, setPreviousPrices] = useState({});
  const [priceHistory, setPriceHistory] = useState({});
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");

  const {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    syncSubscriptions,
    isConnected,
    subscriptions,
    prices,
  } = useSocket();

  // Connect to WebSocket on component mount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Track price history
  useEffect(() => {
    setPreviousPrices(prices);
    // Update price history for charts
    setPriceHistory((prev) => {
      const updated = { ...prev };
      subscriptions.forEach((ticker) => {
        updated[ticker] = [...(prev[ticker] || []), prices[ticker]].slice(-24);
      });
      return updated;
    });
  }, [prices, subscriptions]);

  // Persist watchlist
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const handleAddToWatchlist = (ticker) => {
    if (!watchlist.includes(ticker)) {
      setWatchlist([...watchlist, ticker]);
    }
  };

  const handleRemoveFromWatchlist = (ticker) => {
    setWatchlist(watchlist.filter((t) => t !== ticker));
  };

  const handleSubscribeAll = useCallback(() => {
    syncSubscriptions(SUPPORTED_TICKERS);
  }, [syncSubscriptions]);

  const handleUnsubscribeAll = useCallback(() => {
    syncSubscriptions([]);
  }, [syncSubscriptions]);

  const handleToggleSubscription = useCallback(
    (ticker) => {
      if (subscriptions.includes(ticker)) {
        unsubscribe(ticker);
      } else {
        subscribe(ticker);
      }
    },
    [subscribe, unsubscribe, subscriptions]
  );

  const getPriceChange = (ticker) => {
    if (!previousPrices[ticker] || !prices[ticker]) return 0;
    return prices[ticker] - previousPrices[ticker];
  };

  const getPriceChangePercent = (ticker) => {
    const change = getPriceChange(ticker);
    if (!previousPrices[ticker] || previousPrices[ticker] === 0) return 0;
    return (change / previousPrices[ticker]) * 100;
  };

  const getAveragePriceChange = () => {
    if (subscriptions.length === 0) return 0;
    const changes = subscriptions.reduce(
      (sum, ticker) => sum + getPriceChangePercent(ticker),
      0
    );
    return changes / subscriptions.length;
  };

  const getTotalMarketCap = () => {
    return subscriptions.reduce(
      (sum, ticker) => sum + (prices[ticker] || 0) * 1000000,
      0
    );
  };

  const formattedMarketCap = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
  }).format(getTotalMarketCap());

  // Get unique sectors
  const uniqueSectors = useMemo(() => {
    return ["all", ...new Set(Object.values(TICKER_SECTORS))];
  }, []);

  // Filter and search tickers
  const filteredTickers = useMemo(() => {
    return SUPPORTED_TICKERS.filter((ticker) => {
      const matchesSearch =
        ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        TICKER_SECTORS[ticker]
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesSector =
        sectorFilter === "all" || TICKER_SECTORS[ticker] === sectorFilter;

      return matchesSearch && matchesSector;
    });
  }, [searchQuery, sectorFilter]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Real-time Market Dashboard
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  isConnected
                    ? "bg-emerald-500/20 border border-emerald-500/50"
                    : "bg-red-500/20 border border-red-500/50"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={isConnected ? "text-emerald-300" : "text-red-300"}
                >
                  {isConnected ? " Connected" : " Disconnected"}
                </span>
              </div>
              <div className="text-sm text-slate-400">
                {subscriptions.length} of {SUPPORTED_TICKERS.length} subscribed
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubscribeAll}
              disabled={
                !isConnected ||
                subscriptions.length === SUPPORTED_TICKERS.length
              }
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/20"
            >
              Subscribe All
            </button>
            <button
              onClick={handleUnsubscribeAll}
              disabled={!isConnected || subscriptions.length === 0}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20"
            >
              Unsubscribe All
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-700/50 overflow-x-auto">
          {["overview", "analytics", "alerts", "watchlist", "export"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === tab
                    ? "border-cyan-500 text-cyan-400"
                    : "border-transparent text-slate-400 hover:text-slate-300"
                }`}
              >
                {tab === "overview" && "📊 Overview"}
                {tab === "analytics" && "📈 Analytics"}
                {tab === "alerts" && "🔔 Alerts"}
                {tab === "watchlist" && "⭐ Watchlist"}
                {tab === "export" && "📥 Export"}
              </button>
            )
          )}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Market Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/20 rounded-xl p-6">
              <p className="text-slate-400 text-sm uppercase tracking-wider">
                Active Subscriptions
              </p>
              <p className="text-4xl font-bold text-cyan-400 mt-2">
                {subscriptions.length}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                out of {SUPPORTED_TICKERS.length} tickers
              </p>
            </div>

            <div className="backdrop-blur-sm bg-slate-900/50 border border-emerald-500/20 rounded-xl p-6">
              <p className="text-slate-400 text-sm uppercase tracking-wider">
                Avg Change
              </p>
              <p
                className={`text-4xl font-bold mt-2 ${
                  getAveragePriceChange() >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {getAveragePriceChange().toFixed(2)}%
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {getAveragePriceChange() >= 0 ? " Positive" : " Negative"}
              </p>
            </div>

            <div className="backdrop-blur-sm bg-slate-900/50 border border-purple-500/20 rounded-xl p-6">
              <p className="text-slate-400 text-sm uppercase tracking-wider">
                Portfolio Value
              </p>
              <p className="text-3xl font-bold text-purple-400 mt-2">
                {formattedMarketCap}
              </p>
              <p className="text-xs text-slate-500 mt-2">Combined Market Cap</p>
            </div>
          </div>

          {/* Price Charts for Subscribed Tickers */}
          {subscriptions.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {subscriptions.map((ticker) => (
                <PriceChart
                  key={ticker}
                  ticker={ticker}
                  priceHistory={priceHistory[ticker] || []}
                />
              ))}
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="🔍 Search by ticker or sector..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-cyan-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="px-4 py-2.5 bg-slate-800 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition"
              >
                {uniqueSectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector === "all" ? "All Sectors" : sector}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm text-slate-400">
              Showing {filteredTickers.length} of {SUPPORTED_TICKERS.length}{" "}
              stocks
            </p>
          </div>

          {/* Tickers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickers.length > 0 ? (
              filteredTickers.map((ticker) => (
                <TickerCard
                  key={ticker}
                  ticker={ticker}
                  price={prices[ticker]}
                  previousPrice={previousPrices[ticker]}
                  isSubscribed={subscriptions.includes(ticker)}
                  onToggleSubscribe={() => handleToggleSubscription(ticker)}
                  priceChange={getPriceChange(ticker)}
                  priceChangePercent={getPriceChangePercent(ticker)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400 text-lg">
                  No stocks match your search
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {subscriptions.length > 0 ? (
            <AdvancedAnalytics
              subscriptions={subscriptions}
              prices={prices}
              previousPrices={previousPrices}
            />
          ) : (
            <div className="backdrop-blur-sm bg-slate-900/50 border border-slate-700/50 rounded-xl p-12 text-center">
              <p className="text-slate-400 text-lg">
                Subscribe to tickers to see analytics
              </p>
            </div>
          )}
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === "alerts" && (
        <div className="space-y-6">
          {subscriptions.length > 0 ? (
            <PriceAlerts subscriptions={subscriptions} prices={prices} />
          ) : (
            <div className="backdrop-blur-sm bg-slate-900/50 border border-slate-700/50 rounded-xl p-12 text-center">
              <p className="text-slate-400 text-lg">
                Subscribe to tickers to set price alerts
              </p>
            </div>
          )}
        </div>
      )}

      {/* Watchlist Tab */}
      {activeTab === "watchlist" && (
        <div className="space-y-6">
          <Watchlist
            watchlist={watchlist}
            onAddToWatchlist={handleAddToWatchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
            prices={prices}
            allTickers={SUPPORTED_TICKERS}
          />
        </div>
      )}

      {/* Export Tab */}
      {activeTab === "export" && (
        <div className="space-y-6">
          {subscriptions.length > 0 ? (
            <ExportData subscriptions={subscriptions} prices={prices} />
          ) : (
            <div className="backdrop-blur-sm bg-slate-900/50 border border-slate-700/50 rounded-xl p-12 text-center">
              <p className="text-slate-400 text-lg">
                Subscribe to tickers to export data
              </p>
            </div>
          )}
        </div>
      )}

      {/* Connection Status Panel */}
      {!isConnected && (
        <div className="backdrop-blur-sm bg-yellow-900/20 border border-yellow-500/50 rounded-xl p-6">
          <h3 className="text-yellow-300 font-semibold mb-2">
            Connection Issue
          </h3>
          <p className="text-yellow-200 text-sm">
            The connection to the server is currently lost. Please wait while we
            attempt to reconnect...
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
