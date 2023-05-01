import { type Database } from 'sqlite3'
import sqlite from 'sqlite3'
sqlite.verbose()

export function createDBConnection (): Database {
  return new sqlite.Database('./database.db', (err: Error | null) => {
    if (err !== null) {
      console.error(err.message)
    }
    console.log('Connected to the database.')
  })
}
export function initDB (db: Database): void {
  db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS film (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      classification INTEGER NOT NULL DEFAULT 0,
      picture_url TEXT NOT NULL DEFAULT 'https://bit.ly/3Lk4f6n',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`)
    db.run(`
    CREATE TABLE IF NOT EXISTS session (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filmId INTEGER,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      hour TEXT NOT NULL DEFAULT '00:00',
      available_seats INTEGER NOT NULL DEFAULT 100,
      FOREIGN KEY (filmId) REFERENCES film(id)
    );
    `)
    db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      encrypted_password TEXT NOT NULL,
      encrypted_cpf TEXT,
      encrypted_cep TEXT,
      as_admin INTEGER NOT NULL DEFAULT 0,
      gender TEXT,
      birth_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `)
    db.run(`
    CREATE TABLE IF NOT EXISTS ticket (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        sessionId INTEGER,
        seat INTEGER,
        CREATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES user(id),
        FOREIGN KEY (sessionId) REFERENCES session(id)
    );
    `)
    db.run(`
    CREATE TABLE IF NOT EXISTS dependent (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        sessionId INTEGER,
        name TEXT,
        relationship TEXT,
        FOREIGN KEY (userId) REFERENCES user(id),
        FOREIGN KEY (sessionId) REFERENCES session(id)
    );
    `)
  })
}
