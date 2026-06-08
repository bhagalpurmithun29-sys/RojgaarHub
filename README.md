<div align="center">
  <img src="https://img.shields.io/badge/Rozgaar-Hub-FFB020?style=for-the-badge&logo=next.js&logoColor=white" alt="RozgaarHub Logo" />
  <h1>RozgaarHub</h1>
  <p><strong>Next-Generation Live Labour & Contractor Management Platform</strong></p>
  <p>An on-demand, Uber-style ecosystem connecting Customers, Labourers, and Contractors with real-time tracking, unified communication, and enterprise-grade security.</p>
</div>

<br />

![RozgaarHub Presentation](https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square) ![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square) ![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css) ![Leaflet](https://img.shields.io/badge/Leaflet-Live_Maps-199900?style=flat-square&logo=leaflet)

## 📋 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Platform Modules](#-platform-modules)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
- [Architecture & Operations](#-architecture--operations)

## 🌟 Overview
RozgaarHub is a hyper-local, real-time gig marketplace designed specifically for the unorganized labor sector (Electricians, Plumbers, Carpenters, Masons, and Construction Teams). It bridges the gap between individual customers needing quick fixes and contractors needing bulk manpower, providing a transparent, safe, and efficient digital platform.

## 🚀 Key Features
- **Uber-Style Live Tracking**: Real-time GPS plotting using Leaflet maps for active bookings.
- **Unified Communication Center**: WhatsApp-style P2P chat, group coordination, media sharing, and VOIP calling.
- **Smart KYC & Security**: WebRTC-based live selfie capture, ID verification, and AI-driven fraud & spam detection.
- **Automated Dispatch & Matchmaking**: Geo-fenced routing and skill-based auto-matching.
- **Robust Payment System**: Seamless Razorpay integration, internal wallet ledgers, and automated payout schedules.
- **Emergency SOS & Safety**: 1-click SOS triggers linked directly to the Admin Ops Console.

## 🧩 Platform Modules

### 1. 👤 Customer Dashboard
The primary portal for individuals requesting services.
- **Search & Discovery**: AI-driven search with voice input.
- **Live Booking Tracker**: Interactive map showing worker ETA, distance, and live movement.
- **Wallet & Payments**: Secure checkout for platform fees and labour wages via Razorpay.
- **History & Favorites**: Re-book trusted workers instantly.

### 2. 👷 Labour Dashboard
A specialized portal designed for independent gig workers.
- **Duty State Machine**: Toggle between Online, Offline, Travelling, On-Site, and Break states.
- **Booking Requests**: Queue of incoming jobs with auto-expiry timers.
- **Earnings & Analytics**: Daily earning summaries, reliability scores, and performance AI insights.
- **KYC & Payouts**: Automated withdrawal scheduling (Daily/Weekly/Instant).

### 3. 🏗️ Contractor Dashboard
Enterprise tools for managing large-scale projects and fleets.
- **Live Team Tracking**: A command-center map view showing all assigned workers simultaneously across different sites.
- **Workforce Management**: Bulk team assignments and skill filtering.
- **Invoicing & Ledgers**: Automated generation of project invoices.

### 4. 🛡️ Admin Operations Console
The centralized hub for platform moderation.
- **Live Analytics**: Real-time MongoDB synchronization for platform signups, revenue, and bookings.
- **Trust & Safety**: Resolve SOS alerts, process dispute tickets, and enforce manual KYC holds.
- **System Controls**: Toggle Feature Flags (e.g., enable/disable instant payouts) and manage Global Maintenance Mode.
- **CMS Management**: Update platform banners, emergency helplines, and dynamic headlines.

## 💻 Technology Stack

**Frontend / Client App:**
* Framework: `Next.js 15 (App Router)`
* Library: `React 19`
* Styling: `Tailwind CSS`, `Framer Motion` (Animations)
* Icons: `Lucide React`
* Mapping: `react-leaflet`, `Leaflet.js`
* UI Components: `react-hot-toast`, Glassmorphism UI patterns

**Backend / Infrastructure Integration:**
* Database: `MongoDB Atlas` (Integrated via Node.js backend)
* Authentication: `JWT` (JSON Web Tokens)
* Payments: `Razorpay SDK`
* Media/Storage: `Cloudinary` (KYC Documents & Profile Photos)

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas URI
- Razorpay API Keys

### Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/RojgaarHub.git
   cd RojgaarHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5002/api
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_test_key
   CLOUDINARY_URL=your_cloudinary_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Architecture & Operations
RozgaarHub is built on a Role-Based Access Control (RBAC) architecture, segregating UI flows via distinct routes (`/dashboard/customer`, `/dashboard/labour`, `/dashboard/contractor`, `/admin`). 

The application utilizes heavy client-side state management for real-time features (Map Tracking, Live Chat, Call Overlay) to ensure ultra-low latency, while relying on the MongoDB backend for transactional integrity, KYC auditing, and platform analytics.

---
*Built with ❤️ for organizing the unorganized workforce.*
