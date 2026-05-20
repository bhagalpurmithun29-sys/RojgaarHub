# 🏗️ RozgaarHub: Advanced On-Demand Daily Labour Ecosystem

RozgaarHub is a state-of-the-art, premium, production-ready on-demand daily labour ecosystem built to connect customers and contractors with certified professionals (Electricians, Plumbers, Carpenters, Painters, Cleaners). Designed with robust **AI security phishing shields**, **biometric KYC Aadhaar uploads**, **real Web Audio SOS dispatch beacons**, **offline-first draft synchronization engines**, and a fully unified **Enterprise Admin Console**.

---

## 🚀 Stellar Feature Suites

### 1. 👑 Enterprise Admin Console (`/admin`)
A unified command center for complete platform operations:
*   **📊 Live Operations & Analytics**: Real-time metrics tracking weekly user signups, net revenue, platform commission splits, and active labor counts.
*   **👥 User & Contractor Management**: Block, Unblock, and modify profiles for Customers, Workers, and Contractors.
*   **🥇 Labour KYC Approvals**: Secure checking desk to approve/reject Aadhaar identity document requests.
*   **💰 Financial Commission Ledger**: Tracking ledger accounting for 15% platform cuts and transaction taxes.
*   **⚙️ CMS Config & Feature Flags**: Toggle instant wallet withdrawals, adjust grace cancellation timelines, edit homepage headlines dynamically, and activate **Maintenance Mode** (lockout overlays).
*   **📜 Live System Audit Logs**: Second-level precision chronological logs documenting all administrative activities.

### 2. 🛡️ AI Security Shield Engine (`/security`)
*   **📈 Dynamic Trust Meter**: Visual circular gauge reflecting the user standing based on reviews and cancellations.
*   **📉 Risk Index Monitoring**: Auto-calibrates risk category (`LOW`, `ELEVATED`, `CRITICAL`) based on activity.
*   **💬 NLP Phishing & Spam Scanner**: Interactive scanning portal with real-time keyword parsing (OTP requests, cash deviations, phishing links) and auto-redacting message buffers.
*   **🔬 Anomaly Simulator**: Simulate rapid bot bookings or out-of-area cash deviations to test system response.

### 3. 🔔 In-App Notifications Preference Hub (`/notifications`)
*   **⚙️ Alert Settings**: Customized toggles for *Booking milestone alerts*, *Live chats messages*, and *Promotions surcharges*.
*   **📂 Precision Filters**: Search keyword matches, filter category tabs, and segregate read/unread logs.
*   **🧪 Pushes Simulator**: Custom sandbox to fire simulated alerts, showing permission-blocking handlers.

### 4. 👤 Profile Settings & Operations Deck (`/profile`)
*   **⚠️ Soft Account Deletion**: Deactivates user account into a 30-day grace recovery queue. Users can restore booking histories, credentials, and wallet balances on click.
*   **🏠 Address Book Tagging**: Register and label addresses categorized under `Home 🏠`, `Office 🏢`, and `Construction Site 🏗️`.
*   **🌦️ Scaffolding Weather Locks**: Active weather condition updates (`Sunny`, `Rainy`, `Lightning`). Rainy/Lightning states automatically lock painter and plumber high-altitude scaffolding operations.
*   **🏗️ Customized Requirements Marketplace**: Customers post custom job requirements; nearby professionals pitch bidding quotes; customers accept bids and assign platform contracts dynamically.

### 5. 🚨 Safety & Offline Support (`/safety-support`)
*   **🚨 SOS Emergency Beacons**: Generates real synthesized siren audio frequencies using native Web Audio API oscillators.
*   **🔌 Offline Draft Synchronization**: Auto-saves active ticket inputs during network disruptions. Submitting offline pushes tickets safely into the LocalStorage draft queue, auto-syncing seamlessly once network status is restored.

---

## 🛠️ Technology Stack & Libraries

### 💻 Client (Frontend)
*   **Framework**: Next.js (TypeScript, App Router)
*   **Styling**: Tailwind CSS & Glassmorphism design aesthetics
*   **Icons**: Lucide Icons & Emojis
*   **Compilation**: Clean ESM/CommonJS modules (0 compiler warnings)

### 🖥️ Server (Backend)
*   **Runtime**: Node.js & TypeScript (`ts-node`)
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose Schema Modeling)
*   **Sockets**: Socket.io (Real-time telemetry and chats)
*   **Security**: Bcryptjs (Bcrypt salting) & JSON Web Tokens (JWT)

---

## 🏁 Getting Started & Setup Guide

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB Instance (Local `mongodb://localhost:27017` or MongoDB Atlas URI)

### Step 1: Clone and Repository Setup
Ensure the decoupled workspace directories are prepared:
```bash
git clone https://github.com/your-username/RozgaarHub.git
cd RozgaarHub
```

### Step 2: Configure Server Settings
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Create your `.env` configuration file based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/rozgaarhub
   JWT_SECRET=superSecretSignatureHexToken9901
   CLIENT_URL=http://localhost:3000
   ```
3. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
4. Start the server in developer mode (this auto-seeds the admin account: `admin@rozgaarhub.com` / `Admin@123`):
   ```bash
   npm run dev
   ```

### Step 3: Configure Client Settings
1. Open a new terminal session and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend Next.js dev server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**!

---

## 🔒 Security Standards & Verification
All configurations are built in compliance with modern production specifications:
*   **Stateless Sessions**: JWT tokens verify client APIs authorizations securely.
*   **Encrypted Records**: Passwords are pre-hashed inside Mongoose pre-save database layers.
*   **Zero Type Errors**: Strong typing schemas verified clean via `npx tsc --noEmit`.

---

## 📜 License
This project is licensed under the ISC License. Built with ❤️ by the RozgaarHub Development Team.
