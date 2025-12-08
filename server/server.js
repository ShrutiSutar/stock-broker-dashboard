require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authRoutes = require("./src/routes/authRoutes");
const tickerRoutes = require("./src/routes/tickerRoutes");
const { initializeUserStore } = require("./src/userStore");
const { startPriceGenerator } = require("./src/priceGenerator");
const { SUPPORTED_TICKERS } = require("./src/tickers");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Stock Broker Dashboard API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      tickers: "/api/tickers",
      prices: "/api/prices",
    },
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", tickerRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-in-production"
    );
    socket.userId = decoded.userId;
    socket.email = decoded.email;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

// Initialize user store
const userStore = initializeUserStore();

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.email} (${socket.userId})`);

  // Initialize user in store
  userStore.addUser({
    userId: socket.userId,
    email: socket.email,
    socketId: socket.id,
    subscriptions: new Set(),
  });

  // Send initial data
  const user = userStore.getUser(socket.userId);
  socket.emit("init", {
    prices: userStore.getCurrentPrices(),
    subscriptions: Array.from(user.subscriptions),
  });

  // Subscribe to ticker
  socket.on("subscribe", ({ ticker }) => {
    if (SUPPORTED_TICKERS.includes(ticker)) {
      userStore.subscribe(socket.userId, ticker);
      socket.emit("subscribed", { ticker });
      console.log(`User ${socket.email} subscribed to ${ticker}`);
    }
  });

  // Unsubscribe from ticker
  socket.on("unsubscribe", ({ ticker }) => {
    userStore.unsubscribe(socket.userId, ticker);
    socket.emit("unsubscribed", { ticker });
    console.log(`User ${socket.email} unsubscribed from ${ticker}`);
  });

  // Sync subscriptions
  socket.on("syncSubscriptions", ({ subscriptions }) => {
    const currentSubs = userStore.getUser(socket.userId).subscriptions;
    const newSubs = new Set(
      subscriptions.filter((t) => SUPPORTED_TICKERS.includes(t))
    );
    userStore.setSubscriptions(socket.userId, newSubs);
    socket.emit("init", {
      prices: userStore.getCurrentPrices(),
      subscriptions: Array.from(newSubs),
    });
  });

  // Disconnect handler
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.email}`);
    userStore.removeUser(socket.userId);
  });
});

// Start price generator
startPriceGenerator(io, userStore);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Supported tickers: ${SUPPORTED_TICKERS.join(", ")}`);
});
