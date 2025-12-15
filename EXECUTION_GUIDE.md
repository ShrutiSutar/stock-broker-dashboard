# 🚀 Stock Broker Dashboard - Complete Execution Guide

## Project Overview

A real-time, multi-user stock broker dashboard with WebSocket support, Finnhub API integration, and a premium modern UI.

**Technology Stack:**

- **Backend**: Node.js 18 + Express.js + Socket.IO
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Database**: In-memory (user store)
- **API**: Real stock prices via Finnhub API
- **Containerization**: Docker & Docker Compose

---

## 📋 Prerequisites

Before running the application, ensure you have:

1. **Docker Desktop** installed

   - [Download for Windows](https://www.docker.com/products/docker-desktop)
   - Verify: `docker --version`

2. **Docker Compose** (comes with Docker Desktop)

   - Verify: `docker-compose --version`

3. **Node.js 18+** (optional, for local development)

   - [Download Node.js](https://nodejs.org/)
   - Verify: `node --version` and `npm --version`

4. **Git** (optional, for version control)

---

## 🎯 Quick Start (Recommended)

### **Option 1: Run with Docker Compose (Production-Ready)**

#### Step 1: Navigate to Project Directory

```powershell
cd "c:\Users\shrut\OneDrive\Desktop\stock-broker-dashboard"
```

#### Step 2: Build and Start Containers

```powershell
docker-compose up --build
```

**What this does:**

- Builds Docker images for both frontend and backend
- Starts the server on `http://localhost:3001`
- Starts the client on `http://localhost:5173`
- Initializes real-time WebSocket connection
- Fetches real stock prices from Finnhub API

**Expected Output:**

```
stock-broker-client   | Ready in 245ms
stock-broker-server   | 🚀 Server running on port 3001
stock-broker-server   | ✅ Real stock prices updated from market data
```

#### Step 3: Access the Dashboard

Open your browser and go to:

```
http://localhost:5173
```

#### Step 4: Login

Enter any valid email (no password required):

- Example: `user1@example.com`
- Or: `alice@example.com`

---

### **Option 2: Run Locally Without Docker**

#### Step 2.1: Install Server Dependencies

```powershell
cd "c:\Users\shrut\OneDrive\Desktop\stock-broker-dashboard\server"
npm install
```

#### Step 2.2: Start the Backend Server

```powershell
npm start
```

**Expected Output:**

```
🚀 Server running on port 3001
✅ Real stock prices updated from market data
```

#### Step 2.3: In a New Terminal - Install Client Dependencies

```powershell
cd "c:\Users\shrut\OneDrive\Desktop\stock-broker-dashboard\client"
npm install
```

#### Step 2.4: Start the Frontend Development Server

```powershell
npm run dev
```

**Expected Output:**

```
➜  Local:   http://localhost:5173/
```

#### Step 2.5: Access the Dashboard

Open browser to:

```
http://localhost:5173
```

---

## 🛑 Stopping the Application

### **If Running with Docker Compose:**

```powershell
docker-compose down
```

**Optional: Remove all volumes and images**

```powershell
docker-compose down -v
docker system prune -f
```

### **If Running Locally:**

Press `Ctrl + C` in each terminal window running:

- Backend server (port 3001)
- Frontend dev server (port 5173)

---

## 🔄 Common Docker Commands

### **Check Container Status**

```powershell
docker-compose ps
```

**Expected Output:**

```
NAME                  STATUS              PORTS
stock-broker-client   Up 2 minutes        0.0.0.0:5173->80/tcp
stock-broker-server   Up 2 minutes        0.0.0.0:3001->3001/tcp
```

### **View Server Logs**

```powershell
docker-compose logs server --tail 50
```

### **View Client Logs**

```powershell
docker-compose logs client --tail 50
```

### **View All Logs in Real-Time**

```powershell
docker-compose logs -f
```

Press `Ctrl + C` to exit.

### **Restart Containers**

```powershell
docker-compose restart
```

### **Rebuild After Code Changes**

```powershell
docker-compose down
docker-compose up --build
```

### **Remove All Docker Containers and Images**

```powershell
docker system prune -a -f
```

---

## 📱 Accessing the Dashboard

### **Frontend URL**

```
http://localhost:5173
```

### **Backend API (Server)**

```
http://localhost:3001
```

### **WebSocket Connection**

Automatically established when you log in. Check browser console for WebSocket events.

---

## 🔑 Login & Testing

### **Email-Based Login (No Password Required)**

- Enter any valid email format
- Examples:
  - `user1@example.com`
  - `alice@example.com`
  - `yourname@domain.com`
  - `demo@test.com`

### **Multi-User Testing**

1. Open two browser windows (or use Incognito mode)
2. **Window 1**: Login with `alice@example.com`
3. **Window 2**: Login with `bob@example.com`
4. Each user can independently:
   - Subscribe to different stocks
   - See real-time price updates
   - Manage watchlist
   - Set price alerts
   - Export data

---

## 📊 Stock Tickers Supported

The dashboard supports these 10 stocks with real-time data:

| Ticker | Company            | Sector        |
| ------ | ------------------ | ------------- |
| GOOG   | Google             | Technology    |
| MSFT   | Microsoft          | Technology    |
| AAPL   | Apple              | Technology    |
| AMZN   | Amazon             | Technology    |
| NVDA   | NVIDIA             | Technology    |
| META   | Meta               | Technology    |
| TSLA   | Tesla              | Automotive    |
| NFLX   | Netflix            | Entertainment |
| JPM    | JPMorgan           | Finance       |
| BRK.B  | Berkshire Hathaway | Finance       |

---

## 🛠️ Development Workflow

### **Making Changes to Frontend Code**

1. Edit files in `client/src/`
2. **With Docker:**

   ```powershell
   docker-compose down
   docker-compose up --build
   ```

3. **Without Docker (Local):**
   - Changes auto-reload in dev mode
   - No restart needed

### **Making Changes to Backend Code**

1. Edit files in `server/src/`
2. **With Docker:**

   ```powershell
   docker-compose down
   docker-compose up --build
   ```

3. **Without Docker (Local):**
   - Stop server with `Ctrl + C`
   - Run `npm start` again

---

## 🧪 Testing & Verification

### **Verify Server is Running**

```powershell
curl http://localhost:3001/api/tickers
```

### **Check Real-Time Updates**

1. Login at `http://localhost:5173`
2. Open browser **DevTools** (F12 → Console)
3. Subscribe to a stock
4. Watch console logs for WebSocket messages:
   ```
   priceUpdate: {GOOG: 145.50}
   ```

### **Monitor Server Logs**

```powershell
docker-compose logs server -f
```

Watch for:

- User connections
- Price updates every ~1 second
- Real prices fetched every 5 minutes

---

## 🐛 Troubleshooting

### **Problem: Port Already in Use**

**Error:** `Error: listen EADDRINUSE: address already in use :::3001`

**Solution:**

```powershell
# Find and kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or use alternative port
$env:PORT=3002; npm start
```

### **Problem: Docker Containers Won't Start**

**Solution:**

```powershell
# Clean up everything
docker-compose down -v
docker system prune -f

# Rebuild from scratch
docker-compose up --build
```

### **Problem: Prices Not Updating**

**Check if WebSocket is connected:**

1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by **WS** (WebSocket)
4. You should see an active WebSocket connection

**If not connected:**

```powershell
docker-compose logs server --tail 20
```

### **Problem: Cannot Access http://localhost:5173**

**Check if container is running:**

```powershell
docker-compose ps
```

**If not running:**

```powershell
docker-compose up --build
```

---

## 📊 File Structure

```
stock-broker-dashboard/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── LoginForm.jsx        # Premium login page
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── PriceChart.jsx       # Stock price charts
│   │   │   ├── PriceAlerts.jsx      # Price alert management
│   │   │   ├── Watchlist.jsx        # User watchlist
│   │   │   ├── ExportData.jsx       # CSV/JSON export
│   │   │   ├── AdvancedAnalytics.jsx # Analytics & stats
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   └── useSocket.js         # WebSocket hook
│   │   ├── services/
│   │   │   └── api.js               # API calls & JWT
│   │   ├── App.jsx
│   │   └── index.css                # Tailwind & animations
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.cjs
│   └── Dockerfile
│
├── server/                          # Node.js backend
│   ├── src/
│   │   ├── server.js                # Express & Socket.IO
│   │   ├── auth.js                  # JWT authentication
│   │   ├── userStore.js             # User subscription management
│   │   ├── priceGenerator.js        # Real-time price updates
│   │   ├── realPriceFetcher.js      # Finnhub API integration
│   │   ├── tickers.js               # Supported stocks
│   │   └── routes/
│   │       ├── authRoutes.js        # Login endpoint
│   │       └── tickerRoutes.js      # Stock data endpoint
│   ├── package.json
│   ├── jest.config.js
│   └── Dockerfile
│
├── docker-compose.yml               # Multi-container setup
├── README.md                        # Project overview
├── MULTI_USER_DEMO_GUIDE.md        # Multi-user testing guide
└── EXECUTION_GUIDE.md              # This file
```

---

## 🚀 Performance Tips

### **Optimize Docker Performance**

```powershell
# Allocate more memory to Docker
# Open Docker Desktop Settings → Resources → Memory: 4GB+ (recommended)
```

### **Improve Local Development Speed**

```powershell
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -r node_modules
npm install
```

### **Monitor Resource Usage**

```powershell
docker stats
```

---

## 📝 Environment Variables (Optional)

The application works out-of-the-box, but you can customize:

### **Backend (`server/.env`)**

```
PORT=3001
NODE_ENV=production
FINNHUB_API_KEY=your_key_here
```

### **Frontend (`client/.env`)**

```
VITE_API_URL=http://localhost:3001
```

---

## 📞 Support & Documentation

- **Backend API**: `http://localhost:3001/api/tickers`
- **WebSocket Events**: Check browser console while logged in
- **Real-time Prices**: Updated every ~1 second
- **Market Data**: Fetched from Finnhub API every 5 minutes

---

## ✅ Verification Checklist

Before considering the setup complete, verify:

- [ ] Docker containers are running: `docker-compose ps`
- [ ] Frontend accessible at `http://localhost:5173`
- [ ] Backend running on `http://localhost:3001`
- [ ] Can login with email
- [ ] Can subscribe to stocks
- [ ] Real-time prices updating (watch price numbers change)
- [ ] Multiple users can login simultaneously
- [ ] Each user sees only their subscribed stocks

---

## 🎉 You're Ready!

Your Stock Broker Dashboard is now fully operational. Enjoy real-time stock tracking with multi-user support!

**Quick Links:**

- Dashboard: http://localhost:5173
- API: http://localhost:3001/api/tickers
- Demo Guide: See `MULTI_USER_DEMO_GUIDE.md`

---

**Last Updated**: December 10, 2025
