const Watchlist = ({
  watchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  prices,
  allTickers,
}) => {
  const notInWatchlist = allTickers.filter((t) => !watchlist.includes(t));

  return (
    <div className="backdrop-blur-sm bg-slate-900/50 border border-amber-500/20 rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-amber-300">⭐ Watchlist</h3>
        <span className="text-xs bg-amber-500/20 px-2 py-1 rounded text-amber-300">
          {watchlist.length}/{allTickers.length}
        </span>
      </div>

      {watchlist.length === 0 ? (
        <p className="text-slate-500 text-sm">No tickers in watchlist</p>
      ) : (
        <div className="space-y-2">
          {watchlist.map((ticker) => (
            <div
              key={ticker}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700 hover:border-amber-500/30 transition"
            >
              <div className="flex-1">
                <p className="font-semibold text-white">{ticker}</p>
                <p className="text-sm text-amber-400">
                  ${prices[ticker]?.toFixed(2) || "N/A"}
                </p>
              </div>
              <button
                onClick={() => onRemoveFromWatchlist(ticker)}
                className="px-3 py-1 bg-red-600/20 text-red-300 text-xs rounded hover:bg-red-600/30 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {notInWatchlist.length > 0 && (
        <div className="pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">
            Add to Watchlist
          </p>
          <div className="space-y-2">
            {notInWatchlist.map((ticker) => (
              <div
                key={ticker}
                className="flex items-center justify-between p-3 bg-slate-800/30 rounded border border-slate-700/50 hover:border-amber-500/30 transition"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-200">{ticker}</p>
                  <p className="text-sm text-slate-400">
                    ${prices[ticker]?.toFixed(2) || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => onAddToWatchlist(ticker)}
                  className="px-3 py-1 bg-amber-600/20 border border-amber-500/50 text-amber-300 text-xs rounded hover:bg-amber-600/30 transition"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
