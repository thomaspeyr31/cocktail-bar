const pool = require('../config/db');

async function listOrders(req, res) {
  const { status, table } = req.query;
  let query = 'SELECT * FROM orders WHERE 1=1';
  const params = [];

  if (status) {
    params.push(status);
    query += ` AND status = $${params.length}`;
  }

  if (table) {
    params.push(parseInt(table));
    query += ` AND table_number = $${params.length}`;
  }

  query += ' ORDER BY created_at DESC';

  try {
    const result = await pool.query(query, params);
    return res.json(result.rows);
  } catch {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function getOrder(req, res) {
  try {
    const order = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (order.rows.length === 0) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    const items = await pool.query(
      `SELECT oi.*, c.nom AS cocktail_nom
       FROM order_items oi JOIN cocktails c ON oi.cocktail_id = c.id
       WHERE oi.order_id = $1`,
      [req.params.id]
    );

    return res.json({ ...order.rows[0], items: items.rows });
  } catch {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function createOrder(req, res) {
  const { table_number, items } = req.body;

  if (!table_number || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'table_number et items requis' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      'INSERT INTO orders (table_number) VALUES ($1) RETURNING *',
      [table_number]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, cocktail_id, quantity) VALUES ($1, $2, $3)',
        [orderId, item.cocktail_id, item.quantity]
      );
    }

    await client.query('COMMIT');
    return res.status(201).json(orderResult.rows[0]);
  } catch {
    await client.query('ROLLBACK');
    return res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    client.release();
  }
}

async function updateOrder(req, res) {
  const { status, items } = req.body;
  const validStatuses = ['en_attente', 'en_preparation', 'servi'];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Statut invalide' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'UPDATE orders SET status = COALESCE($1, status), updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    if (items && Array.isArray(items)) {
      await client.query('DELETE FROM order_items WHERE order_id = $1', [req.params.id]);
      for (const item of items) {
        await client.query(
          'INSERT INTO order_items (order_id, cocktail_id, quantity) VALUES ($1, $2, $3)',
          [req.params.id, item.cocktail_id, item.quantity]
        );
      }
    }

    await client.query('COMMIT');
    return res.json(result.rows[0]);
  } catch {
    await client.query('ROLLBACK');
    return res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    client.release();
  }
}

async function deleteOrder(req, res) {
  try {
    await pool.query('DELETE FROM order_items WHERE order_id = $1', [req.params.id]);
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { listOrders, getOrder, createOrder, updateOrder, deleteOrder };
