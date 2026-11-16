require('dotenv').config();

const app = require('./app');
const pool = require('./config/db');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 3000;

async function initDatabase() {
  const initSql = fs.readFileSync(path.join(__dirname, 'db', 'init.sql'), 'utf8');
  await pool.query(initSql);
}

async function seedAdmin() {
  const result = await pool.query(
    "SELECT id FROM users WHERE identifiant = 'admin2024'"
  );

  if (result.rows.length > 0) return;

  const hash = await bcrypt.hash('Admin2024!@#$', 10);
  await pool.query(
    `INSERT INTO users (nom, prenom, identifiant, password_hash, role)
     VALUES ('Admin', 'Default', 'admin2024', $1, 'admin')`,
    [hash]
  );
}

async function start() {
  await initDatabase();
  await seedAdmin();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
