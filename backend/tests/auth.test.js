const request = require('supertest');
const app = require('../src/app');
const { setupDatabase, teardownDatabase, pool } = require('./setup');

beforeAll(async () => {
  await setupDatabase();
});

afterAll(async () => {
  await teardownDatabase();
  await pool.end();
});

describe('POST /api/auth/login', () => {
  test('login avec identifiants valides retourne un token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifiant: 'admin2024', password: 'Admin2024!@#$' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('login avec mauvais mot de passe retourne 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifiant: 'admin2024', password: 'WrongPass123!@' });
    expect(res.status).toBe(401);
  });

  test('identifiant trop court retourne 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifiant: 'short', password: 'Admin2024!@#$' });
    expect(res.status).toBe(400);
  });

  test('mot de passe sans majuscule retourne 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifiant: 'admin2024', password: 'admin2024!@#$' });
    expect(res.status).toBe(400);
  });

  test('mot de passe sans caractère spécial retourne 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifiant: 'admin2024', password: 'Admin2024abcd' });
    expect(res.status).toBe(400);
  });
});
