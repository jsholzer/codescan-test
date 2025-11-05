import Database from 'better-sqlite3';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Ensure data directory exists
if (!existsSync('data')) {
  mkdirSync('data', { recursive: true });
}

const dbPath = join(process.cwd(), 'data', 'todos.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create the todos table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    completed INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create a trigger to automatically update the updated_at field
db.exec(`
  CREATE TRIGGER IF NOT EXISTS update_todos_updated_at
  AFTER UPDATE ON todos
  BEGIN
    UPDATE todos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END
`);

export default db;