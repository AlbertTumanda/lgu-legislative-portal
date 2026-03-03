import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.resolve('lgu_portal.db');
const db = new Database(dbPath);

export function initDB() {
  console.log('Initializing SQLite database...');

  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');

  // Create Tables (Adapted for SQLite)
  
  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Sessions Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      session_date DATETIME NOT NULL,
      type TEXT CHECK(type IN ('Regular', 'Special', 'Public Hearing')),
      status TEXT DEFAULT 'Scheduled',
      description TEXT,
      video_url TEXT,
      streaming_platform TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Legislations Table (Ordinances & Resolutions)
  db.exec(`
    CREATE TABLE IF NOT EXISTS legislations (
      id TEXT PRIMARY KEY,
      legislation_type TEXT CHECK(legislation_type IN ('Ordinance', 'Resolution')),
      number TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      author TEXT,
      status TEXT DEFAULT 'Proposed',
      date_approved DATE,
      file_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Comments Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      legislation_id TEXT,
      session_id TEXT,
      user_name TEXT NOT NULL,
      barangay TEXT NOT NULL,
      email TEXT NOT NULL,
      content TEXT NOT NULL,
      is_verified INTEGER DEFAULT 0,
      status TEXT DEFAULT 'Pending',
      admin_response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(legislation_id) REFERENCES legislations(id),
      FOREIGN KEY(session_id) REFERENCES sessions(id)
    )
  `);

  // Seed Admin User if not exists
  const adminExists = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@lgu.gov.ph');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare(`
      INSERT INTO users (id, full_name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), 'System Administrator', 'admin@lgu.gov.ph', hashedPassword, 'superadmin');
    console.log('Admin user seeded.');
  }

  // Seed Sample Data
  const legislationCount = db.prepare('SELECT count(*) as count FROM legislations').get() as {count: number};
  if (legislationCount.count === 0) {
    const stmt = db.prepare(`
      INSERT INTO legislations (id, legislation_type, number, title, description, author, status, date_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(crypto.randomUUID(), 'Ordinance', 'Ord. No. 2024-001', 'An Ordinance Regulating Plastic Usage', 'Prohibiting the use of single-use plastics in all commercial establishments.', 'Hon. Juan Dela Cruz', 'Approved', '2024-01-15');
    stmt.run(crypto.randomUUID(), 'Ordinance', 'Ord. No. 2024-002', 'Traffic Management Code', 'Comprehensive traffic management system for the municipality.', 'Hon. Maria Santos', 'On 2nd Reading', null);
    stmt.run(crypto.randomUUID(), 'Resolution', 'Res. No. 2024-050', 'Commending the Local High School Team', 'A resolution commending the victory of the local basketball team.', 'Hon. Pedro Penduko', 'Approved', '2024-02-01');
    console.log('Sample legislations seeded.');
  }
  
  const sessionCount = db.prepare('SELECT count(*) as count FROM sessions').get() as {count: number};
  if (sessionCount.count === 0) {
      const stmt = db.prepare(`
        INSERT INTO sessions (id, title, session_date, type, status, video_url, streaming_platform)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      // Past session
      stmt.run(crypto.randomUUID(), '14th Regular Session', '2024-02-15 14:00:00', 'Regular', 'Ended', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'YouTube');
      // Upcoming session
      stmt.run(crypto.randomUUID(), '15th Regular Session', '2024-03-10 14:00:00', 'Regular', 'Scheduled', null, null);
      console.log('Sample sessions seeded.');
  }

  console.log('Database initialization complete.');
}

export { db };
