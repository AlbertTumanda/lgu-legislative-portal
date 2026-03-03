# LGU Legislative Transparency Portal

A production-ready web application for Sangguniang Bayan (Municipal Council) transparency, legislative management, and civic engagement.

## 🏗 System Architecture

### Tech Stack
- **Frontend**: React 19 (Vite), Tailwind CSS, Headless UI, Lucide Icons
- **Backend**: Node.js, Express, SQLite (Dev/Preview), PostgreSQL (Production compatible)
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)
- **Live Streaming**: Embedded YouTube/Facebook Live players
- **Deployment**: Docker-ready, supports Cloud Run / VPS

### Folder Structure
```
/
├── db/                 # Database setup and schemas
│   ├── db.ts           # SQLite connection & initialization
│   └── schema.sql      # PostgreSQL schema for production
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context (Auth, etc.)
│   ├── layouts/        # Layout wrappers (Public, Admin)
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin dashboard pages
│   │   └── ...         # Public pages
│   ├── App.tsx         # Main router setup
│   └── main.tsx        # Entry point
├── server.ts           # Express server & API routes
└── vite.config.ts      # Vite configuration
```

## 🗄 Database Schema (ER Diagram Description)

- **Users**: Admins and staff accounts (ID, email, password_hash, role).
- **Sessions**: Legislative sessions (ID, date, video_url, status).
- **Legislations**: Ordinances and Resolutions (ID, number, title, file_url, status).
- **Comments**: Public feedback (ID, user_name, content, status, legislation_id).
- **AuditLogs**: Security tracking (ID, user_id, action, ip_address).

*See `db_schema_postgres.sql` for the full SQL definition.*

## 🔒 Security Architecture

1.  **Authentication**:
    -   JWT-based stateless authentication.
    -   Passwords hashed using `bcryptjs`.
    -   HttpOnly cookies recommended for production token storage (currently using localStorage for demo simplicity).

2.  **Input Validation**:
    -   API endpoints use parameterized queries (SQLite/Postgres) to prevent SQL Injection.
    -   React escapes content by default to prevent XSS.

3.  **Access Control**:
    -   `/admin/*` routes protected by `AuthContext` and server-side middleware (simulated in this demo).

4.  **Data Privacy (RA 10173)**:
    -   Public comments can be anonymized.
    -   Minimal personal data collection (Name/Email/Barangay).

## 🚀 Deployment Guide

### Prerequisites
- Node.js 20+
- PostgreSQL (optional, defaults to SQLite)

### Build & Run
1.  **Install Dependencies**: `npm install`
2.  **Build Frontend**: `npm run build`
3.  **Start Server**: `npm start` (Runs `server.ts` which serves the API and the built frontend)

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
COPY server.ts ./
CMD ["node", "server.ts"]
```

## 🔮 Future Roadmap

1.  **e-Legislation Tracking**: Full lifecycle management from committee hearing to approval.
2.  **Digital Voting**: Secure voting system for SB members during sessions.
3.  **e-Public Hearing**: Dedicated module for virtual public hearings with verified attendees.
4.  **SMS Notifications**: Integration with Twilio/Globe Labs for session alerts.

---
*Generated for Sangguniang Bayan LGU Portal Project*
