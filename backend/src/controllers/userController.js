const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function listUsers(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, nom, prenom, identifiant, role, created_at FROM users ORDER BY id'
    );
    return res.json(result.rows);
  } catch {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function createUser(req, res) {
  const { nom, prenom, identifiant, password, role } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (nom, prenom, identifiant, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nom, prenom, identifiant, role, created_at`,
      [nom, prenom, identifiant, hash, role || 'user']
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Identifiant déjà utilisé' });
    }
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { role } = req.body;
  const validRoles = ['user', 'staff', 'admin'];

  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ error: 'Rôle invalide' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, nom, prenom, identifiant, role',
      [role, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    return res.json(result.rows[0]);
  } catch {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { listUsers, createUser, updateUser, deleteUser };
