const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, '..', 'database');
const usersFile = path.join(dbDir, 'users.json');

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize users.json if it doesn't exist
if (!fs.existsSync(usersFile)) {
  const initialData = {
    users: [
      {
        id: 1,
        email: 'admin@impactrise.org',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        created_at: new Date().toISOString()
      }
    ]
  };
  fs.writeFileSync(usersFile, JSON.stringify(initialData, null, 2));
  console.log('✅ Database initialized successfully!');
  console.log('📁 Users database created at:', usersFile);
} else {
  console.log('✅ Database already exists at:', usersFile);
}
