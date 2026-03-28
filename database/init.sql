CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'user', 'organizer')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  banner_url TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  manpower INTEGER,
  expected_budget REAL NOT NULL,
  organizer_id INTEGER NOT NULL,
  organizer_name TEXT NOT NULL,
  bank_account TEXT,
  bkash_number TEXT,
  nagad_number TEXT,
  type TEXT NOT NULL CHECK(type IN ('campaign', 'seminar', 'workshop')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  campaign_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  transaction_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

INSERT OR IGNORE INTO users (id, email, password, name, role) VALUES
(1, 'admin@impactrise.org', 'admin123', 'Admin User', 'admin');

INSERT OR IGNORE INTO campaigns (id, title, short_description, description, banner_url, date, time, manpower, expected_budget, organizer_id, organizer_name, bank_account, bkash_number, nagad_number, type) VALUES
(1, 'Digital Literacy Program', 'Empowering rural youth with tech skills', 'A comprehensive program to teach digital literacy to rural youth', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800', '2026-04-15', '10:00 AM', 25, 150000, 1, 'Admin User', '1234567890', '01712345678', '01812345678', 'campaign'),
(2, 'Climate Action Summit', 'Youth-led environmental awareness', 'A seminar on climate change and sustainable solutions', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800', '2026-05-20', '9:00 AM', 40, 200000, 1, 'Admin User', '1234567890', '01712345678', '01812345678', 'seminar'),
(3, 'Leadership Workshop', 'Building future leaders', 'Intensive workshop on youth leadership development', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', '2026-06-10', '2:00 PM', 20, 80000, 1, 'Admin User', '1234567890', '01712345678', '01812345678', 'workshop');
