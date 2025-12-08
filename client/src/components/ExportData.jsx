const ExportData = ({ subscriptions, prices }) => {
  const handleExportCSV = () => {
    const timestamp = new Date().toISOString();
    const headers = ["Ticker", "Price", "Timestamp"];
    const rows = subscriptions.map((ticker) => [
      ticker,
      prices[ticker]?.toFixed(2) || "N/A",
      timestamp,
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n"
    );

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock-prices-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      tickers: subscriptions.map((ticker) => ({
        ticker,
        price: prices[ticker]?.toFixed(2) || "N/A",
      })),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock-prices-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="backdrop-blur-sm bg-slate-900/50 border border-emerald-500/20 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-emerald-300">📥 Export Data</h3>

      <div className="space-y-2">
        <button
          onClick={handleExportCSV}
          disabled={subscriptions.length === 0}
          className="w-full px-4 py-3 bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 rounded-lg hover:bg-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-sm"
        >
          📊 Export as CSV
        </button>

        <button
          onClick={handleExportJSON}
          disabled={subscriptions.length === 0}
          className="w-full px-4 py-3 bg-cyan-600/20 border border-cyan-500/50 text-cyan-300 rounded-lg hover:bg-cyan-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-sm"
        >
          📄 Export as JSON
        </button>
      </div>

      <p className="text-xs text-slate-400">
        {subscriptions.length}{" "}
        {subscriptions.length === 1 ? "ticker" : "tickers"} ready to export
      </p>
    </div>
  );
};

export default ExportData;
