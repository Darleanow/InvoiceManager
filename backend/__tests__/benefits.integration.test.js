const { MySqlContainer } = require("@testcontainers/mysql");
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

let container;
let pool;
let controller;
let app;

beforeAll(async () => {
    // Start MySQL container with root user and test user
    container = await new MySqlContainer()
      .withRootPassword("rootpass")
      .withDatabase("invoice_manager")
      .start();

    // Set environment variables for MySQL pool connection
    process.env.DB_HOST = container.getHost();
    process.env.DB_USER = 'testuser';
    process.env.DB_PASSWORD = 'testpass';
    process.env.DB_NAME = container.getDatabase();
    process.env.DB_PORT = container.getPort();

    // Create a temporary connection as root with multipleStatements: true
    const mysql = require('mysql2/promise');
    const tempConnection = await mysql.createConnection({
        host: container.getHost(),
        user: 'root',
        password: 'rootpass',
        database: 'invoice_manager',
        port: container.getPort(),
        multipleStatements: true,
    });

    // Load schema and populate SQL scripts
    const schemaPath = path.join(__dirname, '..', 'bin', 'schema.sql');
    const populatePath = path.join(__dirname, '..', 'bin', 'populate.sql');

    let schemaSql = fs.readFileSync(schemaPath, 'utf8');
    let populateSql = fs.readFileSync(populatePath, 'utf8');

    // Execute schema and populate scripts
    await tempConnection.query(schemaSql);
    await tempConnection.query(populateSql);

    // Grant all privileges to 'testuser' on 'invoice_manager' database
    await tempConnection.query(`
        CREATE USER 'testuser'@'%' IDENTIFIED BY 'testpass';
        GRANT ALL PRIVILEGES ON invoice_manager.* TO 'testuser'@'%';
        FLUSH PRIVILEGES;
    `);

    // Close the temporary connection
    await tempConnection.end();

    // Import the pool and controllers after setting environment variables
    pool = require('../config/database');
    controller = require('../controllers/benefits/benefits');
    router = require('../routes/index');

    // Initialize Express app for testing
    app = express();
    app.use(express.json());
    app.use('/', router);
    app.post('/benefits', controller.createBenefit);
    app.get('/invoices/:invoiceId/benefits', controller.getBenefitByInvoiceId);
    app.put('/benefits/:id', controller.updateBenefit);
    app.delete('/benefits/:id', controller.deleteBenefit);
    

}, 60000);

afterAll(async () => {
    await container.stop();
    if (pool) {
        await pool.end();
    }
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
