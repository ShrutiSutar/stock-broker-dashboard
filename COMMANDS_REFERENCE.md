# 🚀 Stock Broker Dashboard - Commands Reference

Quick copy-paste commands for running your project.

---

## 📦 Navigate to Project

```powershell
cd "c:\Users\shrut\OneDrive\Desktop\stock-broker-dashboard"
```

---

## 🐳 Docker Commands

### Start Containers (Build + Run)

```powershell
docker-compose up --build
```

### Start Containers (No Rebuild)

```powershell
docker-compose up
```

### Start in Background (No Logs)

```powershell
docker-compose up -d
```

### Stop Containers

```powershell
docker-compose down
```

### Stop & Remove Volumes

```powershell
docker-compose down -v
```

### Check Container Status

```powershell
docker-compose ps
```

### View Server Logs

```powershell
docker-compose logs server --tail 50
```

### View Client Logs

```powershell
docker-compose logs client --tail 50
```

### View All Logs (Real-Time)

```powershell
docker-compose logs -f
```

### Restart Containers

```powershell
docker-compose restart
```

### Rebuild & Restart

```powershell
docker-compose down
docker-compose up --build
```

### Clean Up Everything

```powershell
docker-compose down -v
docker system prune -f
```

---

## 🖥️ Local Development (Without Docker)

### Install Server Dependencies

```powershell
cd "c:\Users\shrut\OneDrive\Desktop\stock-broker-dashboard\server"
npm install
```

### Start Server

```powershell
npm start
```

### Install Client Dependencies

```powershell
cd "c:\Users\shrut\OneDrive\Desktop\stock-broker-dashboard\client"
npm install
```

### Start Client (Dev Mode)

```powershell
npm run dev
```

### Build Client (Production)

```powershell
npm run build
```

---

## 🌐 Access URLs

| Service         | URL                               |
| --------------- | --------------------------------- |
| **Frontend**    | http://localhost:5173             |
| **Backend API** | http://localhost:3001             |
| **API Tickers** | http://localhost:3001/api/tickers |

---

## 🔍 Debugging & Monitoring

### Check if Ports are in Use

```powershell
netstat -ano | findstr :5173
netstat -ano | findstr :3001
```

### Kill Process on Port 5173

```powershell
$pid = (netstat -ano | findstr :5173)[0].Split()[-1]; taskkill /PID $pid /F
```

### Kill Process on Port 3001

```powershell
$pid = (netstat -ano | findstr :3001)[0].Split()[-1]; taskkill /PID $pid /F
```

### View Real-Time Container Stats

```powershell
docker stats
```

### Inspect Container

```powershell
docker inspect stock-broker-server
docker inspect stock-broker-client
```

### View Container Network

```powershell
docker network ls
```

---

## 🧪 Testing Commands

### Test Server API

```powershell
curl http://localhost:3001/api/tickers
```

### Test Login Endpoint

```powershell
curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com"}'
```

### Check Docker Version

```powershell
docker --version
docker-compose --version
```

### Check Node Version (Local)

```powershell
node --version
npm --version
```

---

## 🔑 Quick Login Examples

Once running at `http://localhost:5173`:

| Email             | Purpose   |
| ----------------- | --------- |
| alice@example.com | User 1    |
| bob@example.com   | User 2    |
| user1@example.com | Demo User |
| test@example.com  | Testing   |

---

## 📋 Common Workflows

### Complete Restart (Fresh Build)

```powershell
docker-compose down -v
docker system prune -f
docker-compose up --build
```

### Quick Restart

```powershell
docker-compose down
docker-compose up
```

### View Logs While Running

```powershell
docker-compose logs -f server
```

### Update Code & Rebuild

```powershell
# Make changes to code, then:
docker-compose down
docker-compose up --build
```

### Stop Everything

```powershell
docker-compose down
```

---

## 💡 Pro Tips

1. **Running in Background**:

   ```powershell
   docker-compose up -d
   docker-compose ps  # Check status
   ```

2. **Watch Logs in Real-Time**:

   ```powershell
   docker-compose logs -f
   # Press Ctrl+C to exit
   ```

3. **Rebuild Only Server**:

   ```powershell
   docker-compose up --build stock-broker-server
   ```

4. **Rebuild Only Client**:

   ```powershell
   docker-compose up --build stock-broker-client
   ```

5. **Check Health Status**:
   ```powershell
   docker-compose ps
   # Look for "healthy" status
   ```

---

## 🆘 Troubleshooting Commands

### Port Already in Use?

```powershell
netstat -ano | findstr LISTENING
```

### Clear Docker Cache

```powershell
docker system prune -a -f
```

### Rebuild from Scratch

```powershell
docker-compose down -v
docker-compose up --build
```

### Check Container Logs for Errors

```powershell
docker-compose logs server
docker-compose logs client
```

### SSH into Running Container

```powershell
docker exec -it stock-broker-server sh
docker exec -it stock-broker-client sh
```

---

## 📊 Supported Stocks

```
GOOG, MSFT, AAPL, AMZN, NVDA, META, TSLA, NFLX, JPM, BRK.B
```

---

**Last Updated**: December 10, 2025
