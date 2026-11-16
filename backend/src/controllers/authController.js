const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

async function login(req, res) {
  const { identifiant, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, identifiant, password_hash, role FROM users WHERE identifiant = $1',
      [identifiant]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
      { id: user.id, identifiant: user.identifiant, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    const { password_hash, ...userInfo } = user;
    return res.json({ token, user: userInfo });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { login };
