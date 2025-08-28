# 📈 Portfolio Manager (Stocks Dashboard)

A full-stack application to manage and track stock investments with live data integration.  
Built with **Next.js (TypeScript + Tailwind CSS)** on the frontend and **Node.js + MySQL** on the backend.

---

## 🚀 Features

### Frontend
- Built with **Next.js + TypeScript + TailwindCSS**.
- Two main pages:
  - **Dashboard:**  
    - Displays user-added stocks with fields:  
      `Ticker, Purchase Price, Qty, Investment, Live Price, Present Value, Gain/Loss, Portfolio %, P/E Ratio, EPS`.  
    - Grouped by **sector** with totals.  
    - Gains/Loss shown in **green/red** based on sign.  
    - Live prices fetched **only during Indian market hours (Mon–Fri, 9:15 AM–3:30 PM)**.  
    - Outside market hours, cached data from `localStorage` is used.  
    - If server is down, cached data + last updated time is shown for smooth UX.
  - **Manage Stocks:**  
    - Select stocks from a JSON list and add them with price & quantity.  
    - Delete stocks after selling.  
    - Optimized using table caching and `useTable` for rendering.

### Backend
- Built with **Node.js (Express)** and modular folder structure.  
- Database: **MySQL (AWS RDS)**.  
- Stock data fetched via **YahooFinance2** library:
  - **quote** API for live data (15s polling).
  - **summary** API for EPS (cached daily).  
- Optimizations:
  - `node-cache` for EPS values (updated once daily).  
  - Live prices updated every 15s.  
  - EPS stored in cache to reduce API calls.  
  - P/E ratio calculated from EPS + live price (since most free APIs are US-only).  
  - Stocks stored in memory map for quick access (DB called only on add/delete).

### Hosting
- **Frontend**: Vercel → [Live Demo](https://portfolio-manager-ivory.vercel.app/)  
- **Backend**: Render → [Backend Repo](https://github.com/kbpramod3/portfolio-server.git)  
- **Database**: MySQL on **AWS RDS**

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, TypeScript, TailwindCSS  
- **Backend:** Node.js, Express, Node-cache  
- **Database:** MySQL (AWS RDS)  
- **APIs:** YahooFinance2 (quotes, EPS summary)  
- **Deployment:** Vercel (frontend), Render (backend), AWS RDS (DB)

---

## 📌 Challenges & Solutions

### 1. Market Timing & Caching
- **Challenge:** Indian market is open only during 9:15 AM – 3:30 PM (Mon–Fri). Fetching data outside this caused unnecessary API calls.  
- **Solution:** Implemented market-hour check → fetch live data only when open. Otherwise, fallback to cached values.

### 2. Free API Limitations
- **Challenge:** Many APIs provide free live data only for US stocks. EPS endpoints also restricted.  
- **Solution:** Used YahooFinance2’s `quote` API for live prices, and `summary` API for EPS (cached daily). Calculated P/E ratio manually.

### 3. Backend Optimization
- **Challenge:** Frequent DB queries slowed down dashboard updates.  
- **Solution:** Fetch from DB only on add/delete operations, maintain in-memory map for quick access.

### 4. Deployment Issues
- **Challenge:** Backend on Render initially failed due to incorrect root directory & build script.  
- **Solution:** Fixed `start` script, configured Render environment variables properly.

---

## 📖 Learnings
- How to optimize caching for financial apps.  
- Balancing API limits with computed values (P/E from EPS & live price).  
- Debugging deployment logs in Render & Vercel.  
- Importance of fallback strategies for better user experience.  

---

## 🔗 Links
- **Live App:** [portfolio-manager-ivory.vercel.app](https://portfolio-manager-ivory.vercel.app/)  
- **Frontend Repo:** [portfolio-client](https://github.com/kbpramod3/portfolio-client.git)  
- **Backend Repo:** [portfolio-server](https://github.com/kbpramod3/portfolio-server.git)  
