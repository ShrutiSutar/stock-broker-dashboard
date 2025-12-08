import { useState } from "react";
import { login } from "../services/api";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const result = await login(email);
      setSuccess(true);
      setTimeout(() => {
        onLogin(result.user, result.token);
      }, 600);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blur Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -right-60 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-60 -left-60 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo and Title Section */}
        <div
          className="text-center mb-10 animate-fade-in"
          style={{ animationDuration: "0.8s" }}
        >
          {/* Market Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 backdrop-blur-md border border-cyan-500/30 flex items-center justify-center hover:scale-105 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M13 7h8m0 0v8m0-8L5 19M3 5a2 2 0 012-2h3.28a1 1 0 00-.95.55l-1.3 2.6a1 1 0 00.95 1.45h2l-1.3-2.6a1 1 0 00-.95-.55H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-3.28a1 1 0 00-.95.55l-1.3 2.6a1 1 0 00.95 1.45h2l-1.3-2.6a1 1 0 00-.95-.55H5z"
                />
              </svg>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-[26px] font-semibold text-white mb-2 tracking-tight">
            Login to your Dashboard
          </h1>

          {/* Subheading */}
          <p className="text-[14px] font-medium text-gray-400 opacity-75">
            Real-time stock updates • Multi-user sync
          </p>
        </div>

        {/* Glassmorphism Card */}
        <div
          className="backdrop-blur-2xl bg-white/8 border border-white/12 rounded-2xl p-8 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 animate-fade-in"
          style={{
            animationDuration: "0.8s",
            animationDelay: "0.1s",
            boxShadow:
              "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 2px rgba(255, 255, 255, 0.02)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input Group */}
            <div className="space-y-3">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-white"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400/60 group-focus-within:text-cyan-400 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-[10px] text-white font-medium placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#0ea5e9]/25 focus:border-[#0ea5e9]/50 focus:shadow-[0_8px_30px_rgba(14,165,233,0.15)] hover:border-white/30 hover:bg-white/12"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/15 border border-red-500/40 rounded-xl backdrop-blur-sm animate-slide-down">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-300 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-xl backdrop-blur-sm animate-slide-down">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-emerald-300 text-sm font-medium">
                    Login successful! Redirecting...
                  </p>
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || !email || success}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white font-semibold rounded-[10px] transition-transform duration-200 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(6,182,212,0.12)] disabled:opacity-60 disabled:shadow-none flex items-center justify-center gap-2 active:scale-95 group overflow-hidden relative"
            >
              {/* Button Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Button Content */}
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Connecting...</span>
                  </>
                ) : success ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-pulse"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Authenticated</span>
                  </>
                ) : (
                  <>
                    <span>Access Dashboard</span>
                    <svg
                      className="h-5 w-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>
        </div>

        {/* Footer Section */}
        <div
          className="mt-8 text-center space-y-2 text-xs text-gray-400 opacity-60 animate-fade-in"
          style={{ animationDuration: "0.8s", animationDelay: "0.2s" }}
        >
          <p className="text-[12px]">
            © {new Date().getFullYear()} Stock Broker Dashboard — Secure
            email-based login
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
