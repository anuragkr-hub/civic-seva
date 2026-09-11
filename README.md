# 🏙️ CivicSeva — See. Report. Resolve.

> **“Turning Civic Problems into Civic Action.”**  
> An AI-powered civic issue reporting, geospatial routing, tracking, and resolution-verification platform specifically designed for **Kolkata, West Bengal, India**.

---

## 🌟 What makes CivicSeva different?

CivicSeva is **not a generic complaint form**. Existing municipal complaint portals function as passive black-hole suggestion boxes where citizen tickets languish in unprioritized queues and authorities close tickets without proof.

CivicSeva wraps an intelligent layer around the entire lifecycle of a civic issue:

```
Detect (AI Vision) ➔ Prioritize (0–100 Score) ➔ Route (KMC Dept) ➔ Act (Operations) ➔ Verify (AI Before/After)
```

1. **AI Issue Detection**: Automatic vision classification of potholes, open manholes, garbage heaps, waterlogging, broken streetlights, and damaged footpaths with confidence scores.
2. **Dynamic 0–100 Civic Priority Scoring**: Evaluates public safety hazard, population impact, and proximity to schools, hospitals, and transit hubs so critical emergencies rank at the top of municipal queues.
3. **Geospatial Duplicate Detection (Major Innovation)**: Haversine distance clustering groups complaints within 300 meters into a single unified Civic Incident with community confirmations (*"I’m facing this too"*), eliminating duplicate ticket sprawl.
4. **Smart Municipal Authority Routing**: Automatically matches issues to the exact responsible department:
   - *KMC Roads & Asphalt Department*
   - *KMC Solid Waste Management (SWM)*
   - *KMC Sewerage & Drainage Department*
   - *KMC Lighting & Electricity Wing*
   - *Kolkata Police Traffic Department*
   - *KMDA (Flyovers & Metropolitan Infrastructure)*
5. **AI Official Complaint Generator**: Drafts a formal, evidence-backed grievance letter to the Municipal Commissioner with exact GPS coordinates and citizen consent.
6. **Smart Escalation**: Automatically alerts citizens when an issue exceeds standard SLA response times (e.g. 7 days), generating formal Tier-1/2 escalation notices.
7. **Citizen Verification + AI Before/After Comparison**: Authorities cannot close tickets unilaterally. Citizens upload ground after-photos, and an AI visual comparison engine audits surface restoration confidence (e.g., 94%) before granting **Verified Resolution** status.
8. **Voice Reporting (Web Speech API)**: Citizens can speak their grievances in **English**, **বাংলা (Bengali)**, or **हिन्दी (Hindi)**.

---

## 📍 Kolkata Alignment

- **Wards & Boroughs**: Pre-configured with Kolkata Municipal Corporation (KMC) Wards 1 to 144 across Boroughs I through XVI.
- **Realistic Localities**: College Street, Shyambazar 5-Point, Park Circus 7-Point, Gariahat, Behala Chowrasta, Jadavpur 8B, B.B.D. Bagh, Salt Lake, and Tangra.
- **Multilingual**: Instant toggle between English, বাংলা (Bengali), and हिन्दी (Hindi).

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ or 20+
- npm 9+ or 10+

### Installation

```bash
# 1. Navigate to project folder
cd civic-seva

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 How to Host on GitHub & Deploy Live

You can host and deploy CivicSeva using two easy methods:

---

### Option 1: Host Code on GitHub + 1-Click Deploy on Vercel (Recommended for Next.js)

This is the fastest and most robust method for full-stack Next.js applications:

1. **Initialize Git and Commit**:
   ```bash
   cd civic-seva
   git init
   git add .
   git commit -m "feat: initial CivicSeva Kolkata release"
   ```

2. **Create a New Repository on GitHub**:
   - Go to [github.com/new](https://github.com/new)
   - Name your repository `civic-seva`
   - Keep it Public (or Private) and click **Create repository**

3. **Push Code to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/civic-seva.git
   git branch -M main
   git push -u origin main
   ```

4. **Deploy Live with Vercel (Free)**:
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub.
   - Click **"Add New Project"** and select your `civic-seva` repository.
   - Click **Deploy**.
   - Within 60 seconds, your site is live with a free SSL domain (e.g., `https://civic-seva.vercel.app`)!

---

### Option 2: Deploy to GitHub Pages via GitHub Actions

This repository includes a pre-configured GitHub Actions workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Push your code to GitHub as described above.
2. In your GitHub repository, navigate to **Settings** ➔ **Pages**.
3. Under **Build and deployment** ➔ **Source**, select **GitHub Actions**.
4. To export statically for GitHub Pages:
   - Update `next.config.mjs` to add `output: 'export'`:
     ```javascript
     const nextConfig = {
       output: 'export',
       reactStrictMode: true,
       images: { unoptimized: true }
     };
     export default nextConfig;
     ```
5. Commit and push:
   ```bash
   git add .
   git commit -m "build: configure static export for GitHub Pages"
   git push origin main
   ```
6. GitHub Actions will build and deploy your site to `https://YOUR_GITHUB_USERNAME.github.io/civic-seva/`.

---

## 🧑‍⚖️ Hackathon Judge Demo Walkthrough (1-Click Tour)

CivicSeva features a persistent **Judge Demo Bar** on top of the screen:

1. **Step 1 — Report Issue**:
   - Click **Report a Civic Issue** on the home page.
   - Click the preset button: **"College Street Pothole"**.
   - Observe **AI Vision Classification** (94% confidence) and click **Analyze**.
   - Confirm the detected **Ward 48 (Bowbazar)** on the map.
   - See the **Duplicate Detection Scanner** flag nearby incident `#CS-1042`.
   - Inspect the **91/100 Priority Score breakdown** (Safety 30/30, Proximity to Calcutta University).
   - Review the auto-generated **Official Complaint Email** to KMC Roads Division and click **Submit**.
2. **Step 2 — Switch to Authority Persona**:
   - In the top Judge Bar, switch role to **"KMC Officer"**.
   - Inspect the **Priority Queue** sorted dynamically by urgency (#1 Open Manhole 97/100, #2 Pothole 91/100).
   - Open `#CS-1042`, acknowledge the issue, and mark work started.
3. **Step 3 — Before/After AI Citizen Verification**:
   - Switch back to **"Citizen"** role.
   - Open `#CS-1025` (Gariahat Garbage) or `#CS-1050`.
   - Examine the **Before | After Visual Comparison** slider.
   - Observe the **AI Resolution Match Score (89–94%)**.
   - Select **"✅ Completely Fixed"** and click **Submit Official Citizen Verification** to achieve **Verified Resolution** status!

---

## 🏗️ Architecture & Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Civic palette: Dark Charcoal `#0F172A`, Warm Orange `#EA580C`)
- **Icons**: Lucide React
- **Geodesic Math**: Haversine distance formula for spatial deduplication
- **Data Layer**: Dual-mode storage (Local/Browser IndexedDB + REST API routes)
- **Speech API**: Web Speech API for voice reporting

---

## 📄 License

CivicSeva is open-source under the MIT License. Built for the civic advancement of Kolkata, West Bengal.
