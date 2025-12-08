import { useState } from "react";

const ControlsPanel = ({
  subscriptions,
  onSubscribe,
  onUnsubscribe,
  onSyncSubscriptions,
  isConnected,
  supportedTickers,
}) => {
  const [selectedTicker, setSelectedTicker] = useState(supportedTickers[0]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleSubscribe = () => {
    if (selectedTicker && !subscriptions.includes(selectedTicker)) {
      onSubscribe(selectedTicker);
      showAlertMessage(` Subscribed to ${selectedTicker}`);
    }
  };

  const handleUnsubscribe = () => {
    if (selectedTicker && subscriptions.includes(selectedTicker)) {
      onUnsubscribe(selectedTicker);
      showAlertMessage(` Unsubscribed from ${selectedTicker}`);
    }
  };

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const subscriptionCount = subscriptions.length;
  const totalTickers = supportedTickers.length;
  const isFull = subscriptionCount === totalTickers;
  const isEmpty = subscriptionCount === 0;

  return (
    <div className="space-y-6">
      {/* Alert */}
      {showAlert && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-300 text-sm font-medium animate-pulse">
          {alertMessage}
        </div>
      )}

      {/* Main Controls Card */}
      <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 space-y-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          Subscription Manager
        </h3>

        {/* Subscription Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Active Subscriptions</span>
            <span className="text-xl font-bold text-cyan-400">{subscriptionCount}/{totalTickers}</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${(subscriptionCount / totalTickers) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Ticker Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-300">Select Ticker</label>
          <select
            value={selectedTicker}
            onChange={(e) => setSelectedTicker(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 hover:border-cyan-500/50 focus:border-cyan-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
            disabled={!isConnected}
          >
            {supportedTickers.map((ticker) => (
              <option key={ticker} value={ticker}>
                {ticker} {subscriptions.includes(ticker) ? " Live" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSubscribe}
            disabled={!isConnected || subscriptions.includes(selectedTicker)}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <span>+ Subscribe</span>
          </button>
          <button
            onClick={handleUnsubscribe}
            disabled={!isConnected || !subscriptions.includes(selectedTicker)}
            className="py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2"
          >
            <span>- Unsubscribe</span>
          </button>
        </div>
      </div>

      {/* Active Subscriptions */}
      <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-slate-200 mb-4">Active Subscriptions ({subscriptionCount})</h4>
        {subscriptions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {subscriptions.map((ticker) => (
              <div
                key={ticker}
                className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-center justify-between gap-3 group hover:bg-emerald-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-300 font-semibold">{ticker}</span>
                </div>
                <button
                  onClick={() => {
                    onUnsubscribe(ticker);
                    showAlertMessage(` Unsubscribed from ${ticker}`);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-emerald-400 hover:text-red-400 transition-all duration-200"
                >
                  
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm italic">No active subscriptions. Select a ticker and subscribe to get started.</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 space-y-3">
        <h4 className="text-lg font-bold text-slate-200 mb-4">Quick Actions</h4>
        <button
          onClick={() => {
            onSyncSubscriptions(supportedTickers);
            showAlertMessage(" Subscribed to all tickers");
          }}
          disabled={!isConnected || isFull}
          className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
        >
           Subscribe All
        </button>
        <button
          onClick={() => {
            onSyncSubscriptions([]);
            showAlertMessage(" Unsubscribed from all");
          }}
          disabled={!isConnected || isEmpty}
          className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-orange-500/20"
        >
           Unsubscribe All
        </button>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
          <p className="text-yellow-300 text-sm font-medium"> Not connected to server. Some features are disabled.</p>
        </div>
      )}
    </div>
  );
};

export default ControlsPanel;
