import express from "express";
import { initDB, db } from "./db";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-prod";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database
  initDB();

  app.use(express.json());
  app.use(cors());

  // --- API ROUTES ---

  // Auth
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "8h" });
    res.json({ token, user: { id: user.id, name: user.full_name, email: user.email, role: user.role } });
  });

  // Legislations
  app.get("/api/legislations", (req, res) => {
    const { type, search } = req.query;
    let query = "SELECT * FROM legislations WHERE 1=1";
    const params = [];

    if (type) {
      query += " AND legislation_type = ?";
      params.push(type);
    }
    if (search) {
      query += " AND (title LIKE ? OR number LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY created_at DESC";
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  });

  app.get("/api/legislations/:id", (req, res) => {
    const row = db.prepare("SELECT * FROM legislations WHERE id = ?").get(req.params.id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  });

  // Sessions
  app.get("/api/sessions", (req, res) => {
    const rows = db.prepare("SELECT * FROM sessions ORDER BY session_date DESC").all();
    res.json(rows);
  });

  // Comments
  app.get("/api/comments", (req, res) => {
    const { legislation_id } = req.query;
    if (legislation_id) {
        const rows = db.prepare("SELECT * FROM comments WHERE legislation_id = ? AND status = 'Approved' ORDER BY created_at DESC").all(legislation_id);
        res.json(rows);
    } else {
        // Admin view (all comments)
        // In a real app, check auth here
        const rows = db.prepare("SELECT * FROM comments ORDER BY created_at DESC").all();
        res.json(rows);
    }
  });

  app.post("/api/comments", (req, res) => {
    const { legislation_id, session_id, user_name, barangay, email, content } = req.body;
    
    // Mock OTP verification step would happen before this or via a 2-step process
    // For this demo, we auto-verify but set status to Pending for moderation
    
    const stmt = db.prepare(`
      INSERT INTO comments (id, legislation_id, session_id, user_name, barangay, email, content, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
    `);
    
    const id = crypto.randomUUID();
    stmt.run(id, legislation_id, session_id, user_name, barangay, email, content);
    
    res.json({ success: true, message: "Comment submitted for moderation." });
  });

  // --- SERVING FRONTEND ---
  if (process.env.NODE_ENV !== "production") {
    // Development: Use Vite Middleware
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve Static Files
    const distPath = path.resolve(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    } else {
      console.error("Production build not found. Run 'npm run build' first.");
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

