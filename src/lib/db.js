import Database from 'better-sqlite3';
import path from 'path';

let db = null;

export function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'database', 'impactrise.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function getCampaigns(type = null) {
  const dbConn = getDb();
  const query = type
    ? dbConn.prepare('SELECT * FROM campaigns WHERE type = ? ORDER BY created_at DESC')
    : dbConn.prepare('SELECT * FROM campaigns ORDER BY created_at DESC');

  return type ? query.all(type) : query.all();
}

export function getCampaignById(id) {
  const dbConn = getDb();
  return dbConn.prepare('SELECT * FROM campaigns WHERE id = ?').get(id);
}

export function createCampaign(data) {
  const dbConn = getDb();
  const stmt = dbConn.prepare(`
    INSERT INTO campaigns (title, short_description, description, banner_url, date, time, manpower, expected_budget, organizer_id, organizer_name, bank_account, bkash_number, nagad_number, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(
    data.title,
    data.short_description,
    data.description,
    data.banner_url,
    data.date,
    data.time,
    data.manpower,
    data.expected_budget,
    data.organizer_id,
    data.organizer_name,
    data.bank_account,
    data.bkash_number,
    data.nagad_number,
    data.type
  );
}

export function getDonationsByUser(userId) {
  const dbConn = getDb();
  return dbConn
    .prepare(`
      SELECT d.*, c.title, c.type
      FROM donations d
      JOIN campaigns c ON d.campaign_id = c.id
      WHERE d.user_id = ?
    `)
    .all(userId);
}
