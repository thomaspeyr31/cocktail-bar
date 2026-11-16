const pool = require('../config/db');

async function listCocktails(req, res) {
  const { ingredient, category, search } = req.query;
  let query = 'SELECT * FROM cocktails WHERE 1=1';
  const params = [];

  if (ingredient) {
    params.push(`%${ingredient}%`);
    query += ` AND ingredients::text ILIKE $${params.length}`;
  }

  if (category) {
    params.push(category);
    query += ` AND categorie = $${params.length}`;
  }

  if (search) {
    params.push(`%${search}%`);
    query += ` AND nom ILIKE $${params.length}`;
  }

  query += ' ORDER BY id';

  try {
    const result = await pool.query(query, params);
    return res.json(result.rows);
  } catch {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function getCocktail(req, res) {
  try {
    const result = await pool.query('SELECT * FROM cocktails WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cocktail non trouvé' });
    }
    return res.json(result.rows[0]);
  } catch {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function createCocktail(req, res) {
  const { nom, image, histoire, origine, ingredients, disponibilite, prix, categorie } = req.body;

  if (!nom || !prix) {
    return res.status(400).json({ error: 'Nom et prix requis' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO cocktails (nom, image, histoire, origine, ingredients, disponibilite, prix, categorie)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [nom, image, histoire, origine, JSON.stringify(ingredients || []), disponibilite ?? true, prix, categorie]
    );
    return res.status(201).json(result.rows[0]);
  } catch {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function updateCocktail(req, res) {
  const { nom, image, histoire, origine, ingredients, disponibilite, prix, categorie } = req.body;

  try {
    const result = await pool.query(
      `UPDATE cocktails SET nom=$1, image=$2, histoire=$3, origine=$4,
       ingredients=$5, disponibilite=$6, prix=$7, categorie=$8, updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [nom, image, histoire, origine, JSON.stringify(ingredients || []), disponibilite, prix, categorie, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cocktail non trouvé' });
    }
    return res.json(result.rows[0]);
  } catch {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function patchCocktail(req, res) {
  const fields = req.body;
  const keys = Object.keys(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'Aucun champ à modifier' });
  }

  const setClauses = keys.map((key, i) => {
    if (key === 'ingredients') return `${key} = $${i + 1}::jsonb`;
    return `${key} = $${i + 1}`;
  });

  const values = keys.map(k => k === 'ingredients' ? JSON.stringify(fields[k]) : fields[k]);
  values.push(req.params.id);

  try {
    const result = await pool.query(
      `UPDATE cocktails SET ${setClauses.join(', ')}, updated_at=NOW() WHERE id=$${values.length} RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cocktail non trouvé' });
    }
    return res.json(result.rows[0]);
  } catch {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function deleteCocktail(req, res) {
  try {
    const result = await pool.query('DELETE FROM cocktails WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cocktail non trouvé' });
    }
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { listCocktails, getCocktail, createCocktail, updateCocktail, patchCocktail, deleteCocktail };
