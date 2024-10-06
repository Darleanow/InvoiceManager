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
  await teardownDatabase(); // Use teardown function
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
