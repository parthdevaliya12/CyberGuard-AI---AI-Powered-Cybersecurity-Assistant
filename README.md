# 🛡️ CyberGuard AI — AI-Powered Cybersecurity Assistant

A full-stack MERN application that serves as an AI-powered cybersecurity assistant. CyberGuard AI helps users understand cyber threats, analyze suspicious URLs, report security incidents, and receive defensive cybersecurity recommendations.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [AI Agent Workflow](#ai-agent-workflow)
- [Database Models](#database-models)
- [API Routes](#api-routes)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Seeding the Database](#seeding-the-database)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)

---

## Overview

CyberGuard AI is designed as a **defensive cybersecurity education and incident management platform**. It combines a conversational AI assistant with practical security tools to help users improve their security posture.

### Problem Statement

Cybersecurity threats are increasing, but many users lack the knowledge to protect themselves. CyberGuard AI bridges this gap by providing:

- An AI assistant that explains threats in simple language
- Automated URL risk analysis
- Incident tracking and management
- A curated security knowledge base
- Personal security scoring and checklists

---

## Features

### 🤖 AI Assistant
- Chat with CyberGuard AI about cybersecurity topics
- Conversation history with create/delete functionality
- Suggested prompts for quick start
- Tool-calling agent architecture (URL analysis, incident creation, knowledge search)
- Friendly status messages during tool execution

### 📋 Incident Management
- Create, view, update, and delete incidents
- Filter by status, category, and severity
- Search incidents by keyword
- Track incident lifecycle (Open → Under Review → Resolved → Closed)

### 📊 Dashboards
- **User Dashboard**: Stats cards, security score, recent incidents, recent conversations
- **Admin Dashboard**: System-wide analytics with Recharts charts (incidents by category/severity)

### 🔒 Security Features
- Interactive security checklist (8 items)
- Transparent security score (0-100) with improvement recommendations
- Notification system for incident updates

### 📚 Knowledge Base
- 18 curated cybersecurity articles
- Categories: Phishing, Malware, Password Security, Social Engineering, Account Security, Safe Browsing, Privacy
- Search and filter functionality

### 👤 User Management
- Registration and login with JWT authentication
- Profile management with Cloudinary image upload
- Password change functionality
- Role-based access control (User/Admin)

### 🛠️ Admin Panel
- View all users
- Manage all incidents (update status/severity, delete)
- CRUD management for knowledge articles
- System-wide analytics dashboard

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI framework |
| Vite | Build tool |
| React Router | Client-side routing |
| Tailwind CSS v4 | Styling |
| Axios | HTTP client |
| Context API | State management |
| Recharts | Data visualization |
| Lucide React | Icons |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Helmet | Security headers |
| CORS | Cross-origin requests |
| express-rate-limit | Rate limiting |
| express-validator | Input validation |
| Cloudinary | Image uploads |

### AI
| Technology | Purpose |
|---|---|
| Google Gemini API | AI model |
| @google/generative-ai | SDK |
| gemini-2.0-flash | Model (function calling) |

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│                 React Frontend                    │
│  (Vite + React Router + Tailwind + Context API)  │
└────────────────────┬─────────────────────────────┘
                     │ HTTP (Axios)
┌────────────────────▼─────────────────────────────┐
│              Express.js Backend                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  Middleware: Helmet, CORS, Rate Limit, JWT  │ │
│  └─────────────────────────────────────────────┘ │
│  ┌──────────┐  ┌────────────┐  ┌─────────────┐  │
│  │  Routes  │→│ Controllers │→│  Services    │  │
│  └──────────┘  └────────────┘  └──────┬──────┘  │
│                                       │          │
│  ┌────────────────────────────────────▼────────┐ │
│  │           AI Agent Service                  │ │
│  │  ┌──────────────────────────────────────┐   │ │
│  │  │  Tool 1: Security Knowledge Search   │   │ │
│  │  │  Tool 2: URL Risk Analyzer           │   │ │
│  │  │  Tool 3: Create Incident             │   │ │
│  │  │  Tool 4: Get My Incidents            │   │ │
│  │  └──────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────┘ │
└────────────┬──────────────────┬──────────────────┘
             │                  │
    ┌────────▼───────┐  ┌──────▼──────┐
    │    MongoDB     │  │  Gemini AI  │
    │   (Mongoose)   │  │    API      │
    └────────────────┘  └─────────────┘
```

---

## AI Agent Workflow

```
User Message
     ↓
Express Backend (auth + rate limit)
     ↓
Agent Service
     ↓
Understand Request
     ↓
Send to Gemini with Function Definitions
     ↓
Gemini Decides: Direct Response or Tool Call?
     ↓
┌─────────────────────────┐
│ If Tool Call:            │
│  Execute Tool Function   │
│  Send Result to Gemini   │
│  Get Final Response      │
└─────────────────────────┘
     ↓
Return AI Response to User
```

---

## Database Models

| Model | Purpose |
|---|---|
| **User** | Authentication, profile, role |
| **Conversation** | Chat sessions |
| **Message** | Individual chat messages |
| **Incident** | Security incident reports |
| **KnowledgeArticle** | Cybersecurity articles |
| **Notification** | User notifications |
| **SecurityChecklist** | Per-user checklist progress |

---

## API Routes

```
POST   /api/auth/register          Register user
POST   /api/auth/login             Login
GET    /api/auth/profile           Get profile
PUT    /api/auth/profile           Update profile
PUT    /api/auth/change-password   Change password

GET    /api/incidents              Get my incidents
POST   /api/incidents              Create incident
GET    /api/incidents/stats/me     Get my stats
GET    /api/incidents/:id          Get incident
PUT    /api/incidents/:id          Update incident
DELETE /api/incidents/:id          Delete incident

POST   /api/conversations          Create conversation
GET    /api/conversations          Get my conversations
GET    /api/conversations/:id      Get conversation + messages
POST   /api/conversations/:id/messages  Send message
DELETE /api/conversations/:id      Delete conversation

GET    /api/knowledge              Get articles
GET    /api/knowledge/:id          Get article
POST   /api/knowledge              Create article (admin)
PUT    /api/knowledge/:id          Update article (admin)
DELETE /api/knowledge/:id          Delete article (admin)

GET    /api/notifications          Get my notifications
PUT    /api/notifications/read-all Mark all read
PUT    /api/notifications/:id/read Mark as read

GET    /api/security/checklist     Get checklist
PUT    /api/security/checklist     Update checklist item
GET    /api/security/score         Get security score

GET    /api/admin/stats            Dashboard stats (admin)
GET    /api/admin/users            Get all users (admin)
GET    /api/admin/incidents        Get all incidents (admin)
PUT    /api/admin/incidents/:id    Update incident (admin)
DELETE /api/admin/incidents/:id    Delete incident (admin)
```

---

## Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key

### Clone the Repository
```bash
git clone https://github.com/yourusername/cyberguard-ai.git
cd cyberguard-ai
```

### Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

---

## Environment Variables

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cyberguard-ai
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

---

## Running Locally

### 1. Start MongoDB
Make sure MongoDB is running locally or update `MONGODB_URI` to your Atlas connection string.

### 2. Seed the Database
```bash
cd server
npm run seed
```
This creates:
- Admin user: `admin@cyberguard.com` / `Admin@123`
- 18 cybersecurity knowledge articles

### 3. Start the Backend
```bash
cd server
npm run dev
```

### 4. Start the Frontend
```bash
cd client
npm run dev
```

### 5. Open the Application
Navigate to `http://localhost:5173`

---

## Seeding the Database

```bash
cd server
npm run seed
```

**Default Admin Credentials:**
- Email: `admin@cyberguard.com`
- Password: `Admin@123`

---

## Deployment

### Frontend → Vercel
1. Connect the `client` directory to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-api-url.com/api`

### Backend → Render or Railway
1. Connect the `server` directory
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add all environment variables from `.env.example`
5. Update `CLIENT_URL` to your Vercel domain

### Database → MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get connection string
3. Update `MONGODB_URI` in your deployment environment

---

## Future Improvements

- [ ] Real-time notifications with Socket.IO
- [ ] Two-factor authentication
- [ ] Export incident reports as PDF
- [ ] More AI tools (email header analysis, password strength checker)
- [ ] Dark/light theme toggle
- [ ] User activity audit log
- [ ] Incident assignment to team members
- [ ] Webhook integrations

---

## License

This project is built for educational purposes as a portfolio project.

---

Built with ❤️ using the MERN stack + Google Gemini AI
