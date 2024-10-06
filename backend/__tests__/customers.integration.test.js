const { MySqlContainer } = require("@testcontainers/mysql");
const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs');

let container;
let pool;
let app;
let router;

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

  // Import the pool and router after setting environment variables
  pool = require('../config/database');
  router = require('../routes/index');

  // Initialize Express app for testing
  app = express();
  app.use(express.json());
  app.use('/', router);

}, 60000);

afterAll(async () => {
  await container.stop();
  if (pool) {
    await pool.end();
  }
});

describe('Customer Controller', () => {

  it('should create a new customer', async () => {
    const response = await request(app)
      .post('/customers')
      .send({
        name: 'Test Customer',
        email: 'testcustomer@example.com',
        postal_address: '123 Test St, Testville'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.message).toBe('Customer created successfully');
  });

  it('should retrieve all customers', async () => {
    const response = await request(app)
      .get('/customers');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should retrieve a customer by ID', async () => {
    // First, create a new customer to ensure we have a known customer ID
    const createResponse = await request(app)
      .post('/customers')
      .send({
        name: 'Test Customer',
        email: 'testcustomer@example.com',
        postal_address: '123 Test St, Testville'
      });

    const customerId = createResponse.body.id;

    const response = await request(app)
      .get(`/customers/${customerId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', customerId);
    expect(response.body).toHaveProperty('name', 'Test Customer');
    expect(response.body).toHaveProperty('email', 'testcustomer@example.com');
    expect(response.body).toHaveProperty('postal_address', '123 Test St, Testville');
  });

  it('should update a customer', async () => {
    // First, create a new customer to update
    const createResponse = await request(app)
      .post('/customers')
      .send({
        name: 'Customer To Update',
        email: 'updatable@example.com',
        postal_address: '456 Update Ave, Updatetown'
      });

    const customerId = createResponse.body.id;

    // Update the customer
    const response = await request(app)
      .put(`/customers/${customerId}`)
      .send({
        name: 'Updated Customer',
        email: 'updated@example.com',
        postal_address: '789 Updated Blvd, Updated City'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Customer updated successfully');

    // Retrieve the customer to verify updates
    const getResponse = await request(app)
      .get(`/customers/${customerId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('name', 'Updated Customer');
    expect(getResponse.body).toHaveProperty('email', 'updated@example.com');
    expect(getResponse.body).toHaveProperty('postal_address', '789 Updated Blvd, Updated City');
  });

  it('should delete a customer', async () => {
    // First, create a new customer to delete
    const createResponse = await request(app)
      .post('/customers')
      .send({
        name: 'Customer To Delete',
        email: 'delete@example.com',
        postal_address: '123 Delete St, Deletetown'
      });

    const customerId = createResponse.body.id;

    // Delete the customer
    const response = await request(app)
      .delete(`/customers/${customerId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Customer deleted successfully');

    // Try to retrieve the customer to confirm deletion
    const getResponse = await request(app)
      .get(`/customers/${customerId}`);

    expect(getResponse.status).toBe(404);
    expect(getResponse.body.message).toBe('Customer not found');
  });

  it('should return 404 when retrieving a non-existent customer', async () => {
    const response = await request(app)
      .get('/customers/999999');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Customer not found');
  });

  it('should return 404 when updating a non-existent customer', async () => {
    const response = await request(app)
      .put('/customers/999999')
      .send({
        name: 'Non-existent Customer',
        email: 'nonexistent@example.com',
        postal_address: 'No Address'
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Customer not found');
  });

  it('should return 404 when deleting a non-existent customer', async () => {
    const response = await request(app)
      .delete('/customers/999999');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Customer not found');
  });
});
