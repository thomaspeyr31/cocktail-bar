const request = require('supertest');
const app = require('../src/app');
const { setupDatabase, teardownDatabase, cleanTables, pool } = require('./setup');

let adminToken;

beforeAll(async () => {
  await setupDatabase();
  const res = await request(app)
    .post('/api/auth/login')
    .send({ identifiant: 'admin2024', password: 'Admin2024!@#$' });
  adminToken = res.body.token;
});

afterAll(async () => {
  await teardownDatabase();
  await pool.end();
});

beforeEach(async () => {
  await cleanTables();
});

const mojito = {
  nom: 'Mojito', image: 'https://example.com/mojito.jpg',
  histoire: 'Cocktail cubain classique', origine: 'Cuba',
  ingredients: ['Rhum blanc', 'Citron vert', 'Menthe', 'Sucre', 'Eau gazeuse'],
  disponibilite: true, prix: 9.50, categorie: 'Classique',
};

describe('GET /api/cocktails', () => {
  test('liste publique sans authentification', async () => {
    const res = await request(app).get('/api/cocktails');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /api/cocktails', () => {
  test('admin peut ajouter un cocktail', async () => {
    const res = await request(app).post('/api/cocktails')
      .set('Authorization', `Bearer ${adminToken}`).send(mojito);
    expect(res.status).toBe(201);
    expect(res.body.nom).toBe('Mojito');
  });

  test('sans token retourne 401', async () => {
    const res = await request(app).post('/api/cocktails').send(mojito);
    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/cocktails/:id', () => {
  test('admin peut supprimer un cocktail', async () => {
    const createRes = await request(app).post('/api/cocktails')
      .set('Authorization', `Bearer ${adminToken}`).send(mojito);
    const res = await request(app).delete(`/api/cocktails/${createRes.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(204);
  });
});
