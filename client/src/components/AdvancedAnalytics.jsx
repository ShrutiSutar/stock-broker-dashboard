import { useMemo } from "react";

const AdvancedAnalytics = ({ subscriptions, prices, previousPrices }) => {
  const analytics = useMemo(() => {
    return subscriptions.map((ticker) => {
      const current = prices[ticker] || 0;
      const previous = previousPrices[ticker] || current;
      const change = current - previous;
      const changePercent = previous ? (change / previous) * 100 : 0;

      return {
        ticker,
        current,
        change,
        changePercent,
      };
    });
  }, [subscriptions, prices, previousPrices]);

  const topGainer = useMemo(() => {
    return analytics.length > 0
      ? analytics.reduce((max, a) =>
          a.changePercent > max.changePercent ? a : max
        )
      : null;
  }, [analytics]);

  const topLoser = useMemo(() => {
    return analytics.length > 0
      ? analytics.reduce((min, a) =>
          a.changePercent < min.changePercent ? a : min
        )
      : null;
  }, [analytics]);

  const avgPrice = useMemo(() => {
    if (analytics.length === 0) return 0;
    return analytics.reduce((sum, a) => sum + a.current, 0) / analytics.length;
  }, [analytics]);

  const portfolioValue = useMemo(() => {
    return analytics.reduce((sum, a) => sum + a.current * 100, 0);
  }, [analytics]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Top Gainer */}
      <div className="backdrop-blur-sm bg-gradient-to-br from-emerald-900/30 to-slate-900/50 border border-emerald-500/30 rounded-xl p-6">
        <h4 className="text-sm uppercase tracking-wider text-emerald-400 mb-4">
          🏆 Top Gainer
        </h4>
        {topGainer ? (
          <>
            <p className="text-2xl font-bold text-emerald-300">
              {topGainer.ticker}
            </p>
            <p className="text-lg font-semibold text-emerald-400 mt-2">
              +{topGainer.changePercent.toFixed(2)}%
            </p>
            <p className="text-sm text-slate-400 mt-1">
              ${topGainer.current.toFixed(2)}
            </p>
          </>
        ) : (
          <p className="text-slate-500 text-sm">No data</p>
        )}
      </div>

      {/* Top Loser */}
      <div className="backdrop-blur-sm bg-gradient-to-br from-red-900/30 to-slate-900/50 border border-red-500/30 rounded-xl p-6">
        <h4 className="text-sm uppercase tracking-wider text-red-400 mb-4">
          📉 Top Loser
        </h4>
        {topLoser ? (
          <>
            <p className="text-2xl font-bold text-red-300">{topLoser.ticker}</p>
            <p className="text-lg font-semibold text-red-400 mt-2">
              {topLoser.changePercent.toFixed(2)}%
            </p>
            <p className="text-sm text-slate-400 mt-1">
              ${topLoser.current.toFixed(2)}
            </p>
          </>
        ) : (
          <p className="text-slate-500 text-sm">No data</p>
        )}
      </div>

      {/* Average Price */}
      <div className="backdrop-blur-sm bg-gradient-to-br from-blue-900/30 to-slate-900/50 border border-blue-500/30 rounded-xl p-6">
        <h4 className="text-sm uppercase tracking-wider text-blue-400 mb-4">
          📊 Avg Price
        </h4>
        <p className="text-2xl font-bold text-blue-300">
          ${avgPrice.toFixed(2)}
        </p>
        <p className="text-sm text-slate-400 mt-1">
          {subscriptions.length} subscriptions
        </p>
      </div>

      {/* Portfolio Value (Hypothetical) */}
      <div className="backdrop-blur-sm bg-gradient-to-br from-purple-900/30 to-slate-900/50 border border-purple-500/30 rounded-xl p-6">
        <h4 className="text-sm uppercase tracking-wider text-purple-400 mb-4">
          💰 Portfolio Value
        </h4>
        <p className="text-2xl font-bold text-purple-300">
          $
          {portfolioValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </p>
        <p className="text-sm text-slate-400 mt-1">
          100 shares × {subscriptions.length} tickers
        </p>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
