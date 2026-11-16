const request = require('supertest');
const app = require('../src/app');
const { setupDatabase, teardownDatabase, pool } = require('./setup');

let adminToken;
let staffToken;
let cocktailId;

beforeAll(async () => {
  await setupDatabase();

  const adminRes = await request(app).post('/api/auth/login')
    .send({ identifiant: 'admin2024', password: 'Admin2024!@#$' });
  adminToken = adminRes.body.token;

  await request(app).post('/api/users').set('Authorization', `Bearer ${adminToken}`)
    .send({ nom: 'Staff', prenom: 'User', identifiant: 'staffuser1', password: 'StaffUser01!@#', role: 'staff' });

  const staffRes = await request(app).post('/api/auth/login')
    .send({ identifiant: 'staffuser1', password: 'StaffUser01!@#' });
  staffToken = staffRes.body.token;

  const cocktailRes = await request(app).post('/api/cocktails')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ nom: 'Mojito', prix: 9.50, ingredients: ['Rhum', 'Menthe'], categorie: 'Classique' });
  cocktailId = cocktailRes.body.id;
});

afterAll(async () => {
  await teardownDatabase();
  await pool.end();
});

describe('POST /api/orders', () => {
  test('création publique sans authentification', async () => {
    const res = await request(app).post('/api/orders')
      .send({ table_number: 5, items: [{ cocktail_id: cocktailId, quantity: 2 }] });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('en_attente');
  });

  test('création sans items retourne 400', async () => {
    const res = await request(app).post('/api/orders').send({ table_number: 5 });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/orders/:id', () => {
  test('staff peut modifier le statut', async () => {
    const createRes = await request(app).post('/api/orders')
      .send({ table_number: 2, items: [{ cocktail_id: cocktailId, quantity: 1 }] });
    const res = await request(app).put(`/api/orders/${createRes.body.id}`)
      .set('Authorization', `Bearer ${staffToken}`).send({ status: 'en_preparation' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('en_preparation');
  });

  test('sans token retourne 401', async () => {
    const createRes = await request(app).post('/api/orders')
      .send({ table_number: 2, items: [{ cocktail_id: cocktailId, quantity: 1 }] });
    const res = await request(app).put(`/api/orders/${createRes.body.id}`).send({ status: 'servi' });
    expect(res.status).toBe(401);
  });
});
