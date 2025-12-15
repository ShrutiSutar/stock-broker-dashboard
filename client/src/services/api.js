const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// JWT Token Management
export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const clearToken = () => localStorage.removeItem("token");

// Check if token is expired (basic check - decode JWT)
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Extract user data from JWT token
export const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      email: payload.email,
      userId: payload.userId,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
};

// Clear authentication
export const clearAuth = () => {
  clearToken();
  localStorage.removeItem("user");
};

// Email-based Login
export const login = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();
    if (data.token) {
      setToken(data.token);
    }
    return data;
  } catch (err) {
    throw new Error(err.message || "Login failed. Please try again.");
  }
};

// Get Supported Tickers
export const getTickers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickers`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tickers");
    }

    return response.json();
  } catch (err) {
    throw new Error(err.message || "Failed to fetch tickers");
  }
};

// Get Ticker Price
export const getTickerPrice = async (symbol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickers/${symbol}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${symbol} price`);
    }

    return response.json();
  } catch (err) {
    throw new Error(err.message || `Failed to fetch ${symbol} price`);
  }
};

// API Object for backward compatibility
export const api = {
  login,
  getTickers,
  getTickerPrice,
  getToken,
  setToken,
  clearToken,
  clearAuth,
  getUserFromToken,
  isTokenExpired,
};
