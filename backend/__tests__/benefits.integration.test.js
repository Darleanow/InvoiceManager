const request = require('supertest');
const express = require('express');
const { initDatabase, teardownDatabase } = require('../config/testUtils');

let pool;
let container;
let app;
let router;

beforeAll(async () => {
  // Initialize the database and get pool and container
  const dbInit = await initDatabase();
  pool = dbInit.pool;
  container = dbInit.container;

  router = require("../routes/index");

  // Initialize Express app for testing
  app = express();
  app.use(express.json());
  app.use("/", router);
}, 60000);

afterAll(async () => {
  await teardownDatabase();
});

describe('Benefit Controller', () => {

  const UnitTypes = {
    ITEM: 1,
    SERVICE: 2,
  };

  it('should create a new benefit', async () => {
    const response = await request(app)
      .post('/benefits')
      .send({ object: 'New Object', unit: UnitTypes.ITEM, price_per_unit: 10.50 });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.message).toBe('Benefit created successfully');
  });

  it('should get benefits for a given invoice ID', async () => {
    const response = await request(app).get('/invoices/1/benefits');
    
    expect(response.status).toBe(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    const benefitIds = response.body.map(b => b.id);
    expect(benefitIds).toEqual(expect.arrayContaining([1, 2]));
  });

  it('should update a benefit', async () => {
    const [benefits] = await pool.query(`
      SELECT id FROM invoice_manager.benefit LIMIT 1
    `);
    expect(benefits.length).toBeGreaterThan(0);
    const benefitId = benefits[0].id;
  
    const response = await request(app)
      .put(`/benefits/${benefitId}`)
      .send({ object: 'Updated Benefit', unit: 2, price_per_unit: 150.00 });
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Benefit updated successfully');
  });
  

  it('should delete a benefit', async () => {
    const [insertResult] = await pool.query(`
      INSERT INTO invoice_manager.benefit (object, unit, price_per_unit) VALUES ('Benefit to Delete', 1, 100)
    `);
    const benefitIdToDelete = insertResult.insertId;
  
    const [benefits] = await pool.query(`
      SELECT * FROM invoice_manager.benefit WHERE id = ?
    `, [benefitIdToDelete]);
    expect(benefits.length).toBe(1);
  
    const response = await request(app)
      .delete(`/benefits/${benefitIdToDelete}`);
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Benefit deleted successfully');
  
    const [deletedBenefits] = await pool.query(`
      SELECT * FROM invoice_manager.benefit WHERE id = ?
    `, [benefitIdToDelete]);
    expect(deletedBenefits.length).toBe(0);
  });
  

  it('should return 404 if benefit not found', async () => {
    const response = await request(app)
      .delete('/benefits/999999');
    
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Benefit not found');
  });
});
