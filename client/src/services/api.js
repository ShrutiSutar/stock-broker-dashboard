import axios from "axios";
import jwtDecode from "jwt-decode";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email) => {
  try {
    const response = await api.post("/auth/login", { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

export const getTickers = async () => {
  const response = await api.get("/tickers");
  return response.data;
};

export const getCurrentPrices = async () => {
  const response = await api.get("/prices");
  return response.data;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const clearAuth = () => {
  localStorage.removeItem("token");
};

export const getUserFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return {
      userId: decoded.userId,
      email: decoded.email,
      exp: decoded.exp,
    };
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

export default api;
