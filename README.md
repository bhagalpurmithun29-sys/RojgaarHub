# RozgaarHub

RozgaarHub is a comprehensive online marketplace connecting customers with skilled daily wage workers (Contractors) such as electricians, plumbers, carpenters, and more. The platform facilitates easy booking, secure communication, real-time tracking, and automated payments.

## 🚀 Features

- **Role-Based Access**: Separate, customized dashboards for Customers, Contractors, and Administrators.
- **Service Booking & Tracking**: Real-time status updates from request to completion.
- **Secure KYC & Verification**: Real-time WebRTC selfie capture and document verification for contractors via Cloudinary.
- **Admin Control Center**: 
  - Centralized CMS to manage dynamic platform content (hero headlines, banners).
  - Advanced System Maintenance Module (toggling downtime ETA and emergency help lines).
  - Dispute resolution and security auditing logs.
  - Feature Flags configuration to toggle experimental features live.
- **Modern UI/UX**: Built with a responsive, glassmorphism-inspired design using Tailwind CSS with seamless Light/Dark mode transitions.

## 🛠 Tech Stack

**Frontend:**
- [Next.js 14](https://nextjs.org/) (App Router)
- React
- [Tailwind CSS](https://tailwindcss.com/)
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- MongoDB (via Mongoose)
- JWT Authentication
- Cloudinary (for media/document uploads)

## 📦 Project Structure

```text
RojgaarHub/
├── backend/                  # Node.js + Express Server
│   ├── src/
│   │   ├── app.ts            # Main application entry
│   │   ├── controllers/      # Route controllers (Auth, CMS, User)
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routes
│   │   └── config/           # Database & environment config
│   └── nodemon.json
├── src/                      # Next.js Frontend
│   ├── app/                  # App router pages (admin, auth, dashboard)
│   ├── components/           # Reusable UI components & layouts
│   └── lib/                  # Utilities and frontend configurations
├── public/                   # Static assets
└── tailwind.config.ts        # Tailwind styling configuration
```

## ⚙️ Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/RozgaarHub.git
cd RojgaarHub
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/rozgaarhub
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal window/tab:
```bash
cd RojgaarHub
npm install
```
Create a `.env.local` file in the root directory (if needed for any frontend secrets).
Run the Next.js development server:
```bash
npm run dev
```

### 4. Access the Application
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: `http://localhost:5002`

## 🛡️ Security & Roles
- **Customer**: Can browse services, book workers, leave reviews.
- **Contractor**: Must pass KYC to accept bookings. Has wallet, dispute, and active task management.
- **Admin**: Master control. Uses the `/admin` portal to override systems, audit logs, and manage the CMS. Default admin bypass may be active in the development environment.

## 📄 License
This project is proprietary and confidential. Unauthorized copying of files via any medium is strictly prohibited.
