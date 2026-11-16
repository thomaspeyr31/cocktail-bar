const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const pool = require('../src/config/db');

async function setupDatabase() {
  const initSql = fs.readFileSync(path.join(__dirname, '..', 'src', 'db', 'init.sql'), 'utf8');
  await pool.query(initSql);

  const hash = await bcrypt.hash('Admin2024!@#$', 10);
  await pool.query(
    `INSERT INTO users (nom, prenom, identifiant, password_hash, role)
     VALUES ('Admin', 'Default', 'admin2024', $1, 'admin')
     ON CONFLICT (identifiant) DO NOTHING`,
    [hash]
  );
}

async function teardownDatabase() {
  await pool.query('DROP TABLE IF EXISTS order_items CASCADE');
  await pool.query('DROP TABLE IF EXISTS orders CASCADE');
  await pool.query('DROP TABLE IF EXISTS cocktails CASCADE');
  await pool.query('DROP TABLE IF EXISTS users CASCADE');
}

async function cleanTables() {
  await pool.query('DELETE FROM order_items');
  await pool.query('DELETE FROM orders');
  await pool.query('DELETE FROM cocktails');
  await pool.query('DELETE FROM users WHERE identifiant != $1', ['admin2024']);
}

module.exports = { setupDatabase, teardownDatabase, cleanTables, pool };
