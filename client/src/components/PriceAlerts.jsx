import { useState } from "react";

const PriceAlerts = ({ subscriptions, prices }) => {
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ticker: subscriptions[0] || "GOOG",
    type: "percentage",
    value: 5,
  });

  const handleAddAlert = () => {
    if (formData.value > 0) {
      const newAlert = {
        id: Date.now(),
        ticker: formData.ticker,
        type: formData.type,
        value: formData.value,
        createdAt: new Date(),
      };
      setAlerts([...alerts, newAlert]);
      setShowForm(false);
    }
  };

  const handleRemoveAlert = (id) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="backdrop-blur-sm bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-purple-300">
          🔔 Price Alerts
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1 bg-purple-600/20 border border-purple-500/50 text-purple-300 text-sm rounded hover:bg-purple-600/30 transition"
        >
          {showForm ? "Cancel" : "+ Add Alert"}
        </button>
      </div>

      {showForm && (
        <div className="space-y-3 p-4 bg-slate-800/50 rounded-lg">
          <div>
            <label className="text-xs text-slate-400 uppercase">Ticker</label>
            <select
              value={formData.ticker}
              onChange={(e) =>
                setFormData({ ...formData, ticker: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded text-sm"
            >
              {subscriptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">
              Alert Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded text-sm"
            >
              <option value="percentage">Price Change %</option>
              <option value="above">Price Above $</option>
              <option value="below">Price Below $</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">Value</label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: parseFloat(e.target.value) })
              }
              placeholder="Enter value"
              className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded text-sm"
            />
          </div>

          <button
            onClick={handleAddAlert}
            className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded text-sm transition"
          >
            Create Alert
          </button>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="text-slate-500 text-sm">No alerts set yet</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  {alert.ticker}:{" "}
                  {alert.type === "percentage"
                    ? `±${alert.value}%`
                    : `$${alert.value}`}
                </p>
                <p className="text-xs text-slate-400">
                  Current: ${prices[alert.ticker]?.toFixed(2) || "N/A"}
                </p>
              </div>
              <button
                onClick={() => handleRemoveAlert(alert.id)}
                className="px-3 py-1 bg-red-600/20 text-red-300 text-xs rounded hover:bg-red-600/30 transition"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PriceAlerts;
