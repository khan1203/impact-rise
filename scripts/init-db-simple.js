const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'impactrise.db');
const sqlPath = path.join(__dirname, '..', 'database', 'init.sql');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

try {
  // Try to use better-sqlite3
  try {
    const Database = require('better-sqlite3');
    const db = new Database(dbPath);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    db.exec(sql);
    console.log('✅ Database initialized successfully with better-sqlite3!');
    db.close();
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' || err.message.includes('bindings')) {
      // Fallback: create a simple marker file
      console.log('⚠️  better-sqlite3 not available, creating placeholder...');
      console.log('The database will be created automatically when you start the server.');
      fs.writeFileSync(path.join(dbDir, '.placeholder'), 'Database will be created on first run');
      console.log('✅ Placeholder created at ' + path.join(dbDir, '.placeholder'));
    } else {
      throw err;
    }
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
