# ⚙️ CivicSeva Backend REST API

This is the standalone **Node.js / Express REST API backend** for CivicSeva Kolkata.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the API Server
```bash
npm start
```

Server starts on `http://localhost:5000` (or `PORT` from environment).

---

## 📡 REST API Documentation

### 1. Health Check
- **`GET /health`**
  - Returns backend uptime and operational status.

### 2. Civic Incidents
- **`GET /api/incidents`**
  - Query parameters: `?ward=48&category=pothole&severity=critical`
  - Returns array of incidents.
- **`GET /api/incidents/:id`**
  - Returns single incident by ID (e.g., `/api/incidents/CS-1042`).
- **`POST /api/incidents`**
  - Body: JSON incident object. Automatically computes priority score and saves into registry.
- **`PATCH /api/incidents/:id`**
  - Actions supported in body:
    - `{ "action": "confirm", "actor": "Citizen Name" }` -> bumps confirmation count and recalculates priority score.
    - `{ "action": "update_status", "status": "work_started", "note": "Crew dispatched" }`
    - `{ "action": "resolve_by_authority", "note": "Repairs complete", "evidenceUrl": "..." }`
    - `{ "action": "verify_by_citizen", "verdict": "completely_fixed", "citizenNotes": "Verified on site" }`
    - `{ "action": "escalate", "reason": "SLA response time exceeded" }`

### 3. AI Inference Endpoints
- **`POST /api/ai/analyze`**
  - Body: `{ "imageHint": "pothole", "userDescription": "..." }`
  - Returns vision classification, confidence score, and feature list.
- **`POST /api/ai/verify`**
  - Body: `{ "category": "pothole", "citizenVerdict": "completely_fixed" }`
  - Returns AI before/after similarity score (e.g., 94%) and surface restoration grade.

### 4. Authorities & Wards
- **`GET /api/authorities`**
  - Returns Kolkata municipal departments and contacts.
- **`GET /api/authorities/wards`**
  - Returns KMC Wards 1 to 144 registry with coordinates and councilors.

---

## ☁️ How to Host Backend (Render / Railway / Heroku)

1. Push your code to GitHub.
2. In [Render.com](https://render.com) or [Railway.app](https://railway.app):
   - Choose **New Web Service**.
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Set environment variable: `PORT=5000`
3. Your live API URL will be: `https://YOUR-BACKEND.onrender.com`.
