"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = exports.createDBConnection = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
sqlite3_1.default.verbose();
function createDBConnection() {
    return new sqlite3_1.default.Database('./database.db', (err) => {
        if (err !== null) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    });
}
exports.createDBConnection = createDBConnection;
function initDB(db) {
    db.serialize(() => {
        db.run(`
    CREATE TABLE IF NOT EXISTS film (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      classification INTEGER NOT NULL DEFAULT 0,
      picture_url TEXT NOT NULL DEFAULT 'https://bit.ly/3Lk4f6n',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`);
        db.run(`
    CREATE TABLE IF NOT EXISTS session (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filmId INTEGER,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      hour TEXT NOT NULL DEFAULT '00:00',
      available_seats INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (filmId) REFERENCES film(id)
    );
    `);
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
    `);
        db.run(`
    CREATE TABLE IF NOT EXISTS ticket (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        sessionId INTEGER,
        seats TEXT,
        CREATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES user(id),
        FOREIGN KEY (sessionId) REFERENCES session(id)
    );
    `);
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
    `);
    });
}
exports.initDB = initDB;
