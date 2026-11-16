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

describe('GET /api/users', () => {
  test('admin peut lister les utilisateurs', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('sans token retourne 401', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/users', () => {
  test('admin peut créer un utilisateur', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nom: 'Dupont', prenom: 'Jean', identifiant: 'jeandupont', password: 'JeanDupont1!@#', role: 'staff' });
    expect(res.status).toBe(201);
    expect(res.body.identifiant).toBe('jeandupont');
  });

  test('identifiant dupliqué retourne 409', async () => {
    await request(app).post('/api/users').set('Authorization', `Bearer ${adminToken}`)
      .send({ nom: 'Test', prenom: 'User', identifiant: 'testuser01', password: 'TestUser01!@#$', role: 'user' });
    const res = await request(app).post('/api/users').set('Authorization', `Bearer ${adminToken}`)
      .send({ nom: 'Test', prenom: 'Deux', identifiant: 'testuser01', password: 'TestUser02!@#$', role: 'user' });
    expect(res.status).toBe(409);
  });
});

describe('DELETE /api/users/:id', () => {
  test('admin peut supprimer un utilisateur', async () => {
    const createRes = await request(app).post('/api/users').set('Authorization', `Bearer ${adminToken}`)
      .send({ nom: 'Suppr', prenom: 'User', identifiant: 'suppruser1', password: 'SupprUser01!@#', role: 'user' });
    const res = await request(app).delete(`/api/users/${createRes.body.id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(204);
  });
});
