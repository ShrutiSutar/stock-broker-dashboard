import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import { getToken, getUserFromToken, clearAuth } from "./services/api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const userData = getUserFromToken(token);
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        clearAuth();
      }
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-cyan-500/20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-300 bg-clip-text text-transparent">
              Stock Broker Dashboard
            </h1>
            <p className="text-slate-400 text-sm">
              Real-time stock price monitoring
            </p>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-slate-400">Welcome, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-900 border border-cyan-500/30 text-cyan-500 rounded-lg hover:bg-cyan-500/10 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isAuthenticated ? (
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          <div className="max-w-md mx-auto">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-2">Login to Dashboard</h2>
              <p className="text-muted mb-6">
                Enter your email to access real-time stock prices
              </p>
              <LoginForm onLogin={handleLogin} />
            </div>

            <div className="mt-8 text-center text-muted">
              <p>Demo emails: user1@example.com, user2@example.com</p>
              <p className="text-sm mt-2">
                <span className="font-semibold">Supported tickers:</span> GOOG,
                TSLA, AMZN, META, NVDA
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-accent/20 py-6">
        <div className="container mx-auto px-4 text-center text-muted text-sm">
          <p>
            Stock Broker Client Dashboard • Real-time WebSocket updates •{" "}
            {new Date().getFullYear()}
          </p>
          <p className="mt-2">
            <span className="inline-block w-2 h-2 rounded-full bg-up mr-1"></span>
            Price updates every second •
            <span className="inline-block w-2 h-2 rounded-full bg-down ml-3 mr-1"></span>
            Multi-user support
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
