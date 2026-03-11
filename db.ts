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

  // Activity Logs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // News & Events Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS news_events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT CHECK(category IN ('News', 'Event')),
      author TEXT,
      event_date DATETIME,
      image_url TEXT,
      is_published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // SB Members Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sb_members (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      position TEXT NOT NULL,
      image_url TEXT,
      committees_chairmanship TEXT,
      committees_membership TEXT,
      rank INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migration: Add author column if it doesn't exist
  try {
    db.exec("ALTER TABLE news_events ADD COLUMN author TEXT");
  } catch (e) {
    // Column might already exist
  }

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

  const newsCount = db.prepare('SELECT count(*) as count FROM news_events').get() as {count: number};
  if (newsCount.count === 0) {
    const stmt = db.prepare(`
      INSERT INTO news_events (id, title, content, category, author, event_date, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(crypto.randomUUID(), 'New Municipal Health Center Opens', 'The local government officially inaugurated the new health center to serve more residents.', 'News', 'PIO Office', null, 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80');
    stmt.run(crypto.randomUUID(), 'Annual Town Fiesta 2024', 'Join us for a week-long celebration of our cultural heritage and community spirit.', 'Event', 'Tourism Office', '2024-05-15 08:00:00', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80');
    stmt.run(crypto.randomUUID(), 'Tree Planting Activity', 'Volunteers are invited to participate in our environmental conservation efforts.', 'Event', 'MENRO', '2024-04-22 06:00:00', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80');
    console.log('Sample news and events seeded.');
  }

  const memberCount = db.prepare('SELECT count(*) as count FROM sb_members').get() as {count: number};
  if (memberCount.count === 0) {
    const stmt = db.prepare(`
      INSERT INTO sb_members (id, full_name, position, image_url, rank)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(crypto.randomUUID(), 'Atty. Antonino M. Jumawid', 'Vice Mayor', '/dodojumawid.png', 1);
    stmt.run(crypto.randomUUID(), 'Joel Daquis', 'Municipal Councilor', '/joel_daquis.png', 2);
    stmt.run(crypto.randomUUID(), 'Precious Joy "Yes" Dumagan-Baguio', 'Municipal Councilor', '/yes.png', 3);
    stmt.run(crypto.randomUUID(), 'Sixto T. Dano', 'Municipal Councilor', '/Dano.png', 4);
    stmt.run(crypto.randomUUID(), 'Marvin Pancho', 'Municipal Councilor', '/Pancho.png', 5);
    stmt.run(crypto.randomUUID(), 'Ronald T. Dampog', 'Municipal Councilor', '/ronie_dampog.png', 6);
    stmt.run(crypto.randomUUID(), 'Jesus Palingcod', 'Municipal Councilor', '/jesus_palingcod.png', 7);
    stmt.run(crypto.randomUUID(), 'Candido Salces', 'Municipal Councilor', '/candido_salces.png', 8);
    stmt.run(crypto.randomUUID(), 'Segundo Bautista', 'Municipal Councilor', '/Bautista.png', 9);
    console.log('SB members seeded.');
  }

  console.log('Database initialization complete.');
}

export { db };
