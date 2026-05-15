# AI Notes Workspace

An AI-powered full-stack productivity and note management platform built using the MERN stack. Users can create, manage, archive, search, and share notes while leveraging AI-generated summaries, action items, and suggested titles.

## Live Demo

### Frontend
https://ai-notes-workspace-psi.vercel.app/

### Backend API
[ttps://ai-notes-workspace-vafu.onrender.com
---

# Features

## Authentication

* User signup and login
* JWT-based authentication
* Protected dashboard routes
* Secure password hashing using bcrypt
* Persistent login using localStorage
* Form validation and error handling

## Notes Workspace

* Create notes
* Edit existing notes
* Delete notes
* Archive notes
* View archived notes
* Tag-based organization
* Search notes and tags
* Auto-save draft persistence using localStorage

## AI Features

* AI-generated note summaries
* AI-generated action items
* AI-generated suggested titles
* OpenRouter API integration
* DeepSeek AI model integration

## Productivity Insights

* Total notes count
* AI-generated notes count
* Shared notes count
* Weekly productivity summary
* Most-used tags visualization
* Recent notes insights

## Public Sharing

* Share notes publicly using generated links
* Public shared note page without authentication


---

# Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs

## AI Integration

* OpenRouter API
* DeepSeek Chat Model

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

# Folder Structure

```bash
peblo-ai-notes-workspace/
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# Environment Variables

Create a `.env` file inside the backend directory.

## Example

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
PORT=5000
```

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
```

## 2. Navigate to Project

```bash
cd peblo-ai-notes-workspace
```

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Deployment

## Frontend Deployment

* Hosted on Vercel

## Backend Deployment

* Hosted on Render

## Database

* MongoDB Atlas cloud database

---


# Author

Penta Karthik

---

