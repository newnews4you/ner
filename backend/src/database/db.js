import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DATABASE_PATH || join(__dirname, '../../database.sqlite');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Promisify database methods
db.run = promisify(db.run.bind(db));
db.get = promisify(db.get.bind(db));
db.all = promisify(db.all.bind(db));

// Initialize database tables
export const initDatabase = async () => {
  try {
    // Users table
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT,
        provider TEXT DEFAULT 'email',
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Subjects table
    await db.run(`
      CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        teacher TEXT NOT NULL,
        grade INTEGER NOT NULL,
        gradient TEXT NOT NULL,
        icon_name TEXT NOT NULL,
        current_topic TEXT,
        next_assessment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Topics table
    await db.run(`
      CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'locked',
        duration TEXT,
        score INTEGER,
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
      )
    `);

    // Materials table
    await db.run(`
      CREATE TABLE IF NOT EXISTS materials (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        subject_id TEXT,
        topic_id INTEGER,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        file_path TEXT,
        size TEXT,
        items INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
        FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
      )
    `);

    // Progress table
    await db.run(`
      CREATE TABLE IF NOT EXISTS progress (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        topic_id INTEGER,
        progress_percentage INTEGER DEFAULT 0,
        time_spent INTEGER DEFAULT 0,
        last_studied DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
        FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
      )
    `);

    // Chat messages table (for AI tutor)
    await db.run(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        subject_id TEXT,
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
      )
    `);

    // Study sessions table
    await db.run(`
      CREATE TABLE IF NOT EXISTS study_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        subject_id TEXT,
        duration INTEGER NOT NULL,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default db;

