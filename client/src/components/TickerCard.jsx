import { memo, useMemo } from "react";

const TickerCard = memo(({
  ticker,
  price,
  previousPrice,
  isSubscribed,
  onToggleSubscribe,
  priceChange,
  priceChangePercent,
}) => {
  const getTickerName = (ticker) => {
    const names = {
      GOOG: "Alphabet Inc.",
      TSLA: "Tesla Inc.",
      AMZN: "Amazon.com Inc.",
      META: "Meta Platforms Inc.",
      NVDA: "NVIDIA Corporation",
    };
    return names[ticker] || ticker;
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "$0.00";
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const isPositive = useMemo(() => priceChange >= 0, [priceChange]);
  const displayPrice = price || 0;
  const displayChange = priceChange || 0;
  const displayChangePercent = priceChangePercent || 0;

  return (
    <div className={`group relative overflow-hidden rounded-2xl backdrop-blur-sm bg-gradient-to-br ${
      isPositive 
        ? 'from-slate-900 to-emerald-950 border border-emerald-500/20' 
        : 'from-slate-900 to-red-950 border border-red-500/20'
    } p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1`}>
      
      <div className={`absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 ${
        isPositive ? 'bg-emerald-500' : 'bg-red-500'
      }`}></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-bold text-white">{ticker}</h3>
              {isSubscribed && (
                <span className={`text-xs px-3 py-1 rounded-full font-semibold animate-pulse ${
                  isPositive 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-red-500/20 text-red-300'
                }`}>
                   Live
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm mt-1">{getTickerName(ticker)}</p>
          </div>

          <button
            onClick={onToggleSubscribe}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
              isSubscribed
                ? `bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/20`
                : `bg-slate-700/50 text-slate-200 border border-slate-600 hover:bg-slate-600 hover:shadow-lg`
            }`}
          >
            {isSubscribed ? ' Live' : 'Subscribe'}
          </button>
        </div>

        <div className="mb-6 space-y-2">
          <div className="text-5xl font-bold font-mono text-white tracking-tight">
            {formatPrice(displayPrice)}
          </div>

          <div className={`flex items-center gap-3 text-lg font-semibold ${
            isPositive ? 'text-emerald-400' : 'text-red-400'
          }`}>
            <span className="text-2xl">
              {isPositive ? '' : ''}
            </span>
            <span>
              {isPositive ? '+' : ''}{displayChange.toFixed(2)}
            </span>
            <span className="text-slate-500">
              ({displayChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Current</p>
            <p className="text-lg font-semibold text-white mt-1">{formatPrice(displayPrice)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Change %</p>
            <p className={`text-lg font-semibold mt-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {displayChangePercent.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${
            isSubscribed 
              ? 'bg-emerald-500 animate-pulse' 
              : 'bg-slate-600'
          }`}></div>
          <span className={`text-xs font-medium ${
            isSubscribed 
              ? 'text-emerald-300' 
              : 'text-slate-400'
          }`}>
            {isSubscribed ? 'Receiving Updates' : 'Not Subscribed'}
          </span>
        </div>
      </div>
    </div>
  );
});

TickerCard.displayName = 'TickerCard';

export default TickerCard;
