const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'impactrise.db');
const sqlPath = path.join(__dirname, '..', 'database', 'init.sql');

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
const sql = fs.readFileSync(sqlPath, 'utf8');

db.exec(sql);

console.log('Database initialized successfully!');
db.close();
