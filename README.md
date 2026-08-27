# 🛡️ CyberGuard AI — AI-Powered Cybersecurity Assistant

CyberGuard AI is a comprehensive, AI-driven cybersecurity dashboard built on the MERN stack. It empowers users with intelligent threat analysis, real-time incident reporting, and an interactive educational knowledge base to stay safe online.

## ✨ Features

- 🤖 **AI Security Assistant:** Powered by Google's Gemini API, the AI assistant analyzes suspicious URLs, explains complex cybersecurity concepts (like Phishing and Malware), and provides actionable defense strategies.
- 🚨 **Incident Management:** Users can report and track security incidents (e.g., compromised accounts, suspicious emails).
- 🔐 **Role-Based Access Control:** Distinct dashboards for standard users and administrators. Admins can manage all users, incidents, and the security knowledge base.
- 📚 **Knowledge Base:** A searchable library of cybersecurity best practices, prevention strategies, and incident response guides.
- 📊 **Security Dashboard:** Visual analytics and personalized security checklists to evaluate and improve your overall security posture.
- 🎨 **Premium UI/UX:** A sleek, responsive, dark-mode-first interface built with modern CSS techniques (glassmorphism, neon glows, and custom animations).

## 🛠️ Technology Stack

**Frontend (Client):**
- React.js (Vite)
- React Router DOM for navigation
- Context API for state management (Auth, Toasts)
- Lucide React for iconography
- Axios for API requests

**Backend (Server):**
- Node.js & Express.js
- MongoDB & Mongoose (Database & ODM)
- JSON Web Tokens (JWT) for secure authentication
- Google Generative AI SDK (Gemini Flash model integration)
- Cloudinary (for image uploads and processing)
- Express Rate Limit (for API protection)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB installed locally or a MongoDB Atlas URI
- A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd "CyberGuard AI — AI-Powered Cybersecurity Assistant"
   ```

2. **Setup the Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add the following variables:
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
   *Note: Ensure you seed the database (if a seed script is provided) to generate the initial admin account.*

3. **Setup the Frontend**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

You will need two terminal windows to run the client and server concurrently.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

## 👥 Default Accounts
If you have run the database seeders, you can access the system using:
- **Admin:** `admin@cyberguard.com` / `Admin@123` (Provides access to the complete Administration panel)
- **User:** Register a new account on the signup page.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License
This project is open-source and available under the MIT License.
