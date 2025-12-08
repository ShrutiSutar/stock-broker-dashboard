import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceChart = ({ ticker, priceHistory = [] }) => {
  const last24Hours = priceHistory.slice(-24);

  const data = {
    labels: last24Hours.map((_, i) => `${i}h`),
    datasets: [
      {
        label: `${ticker} Price`,
        data: last24Hours,
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#06b6d4",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#e2e8f0",
          font: { size: 12 },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#06b6d4",
        bodyColor: "#e2e8f0",
        borderColor: "#06b6d4",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: "rgba(148, 163, 184, 0.1)" },
        ticks: { color: "#94a3b8" },
      },
      x: {
        grid: { color: "rgba(148, 163, 184, 0.1)" },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  return (
    <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/20 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-cyan-300 mb-4">
        Price Trend (24h)
      </h3>
      {last24Hours.length > 1 ? (
        <div style={{ height: "300px" }}>
          <Line data={data} options={options} />
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-slate-400">
          Waiting for price data...
        </div>
      )}
    </div>
  );
};

export default PriceChart;
