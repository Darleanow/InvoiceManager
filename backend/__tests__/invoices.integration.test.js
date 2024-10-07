const request = require("supertest");
const express = require("express");
const {
  setupTestEnvironment,
  teardownTestEnvironment,
} = require("./utils/testSetup");

let app, pool;

beforeAll(async () => {
  const { pool: dbPool, app: expressApp } = await setupTestEnvironment(
    "../routes/index"
  );
  pool = dbPool;
  app = expressApp;
}, 60000);
afterAll(async () => {
  await teardownTestEnvironment();
});

describe("Invoice Controller", () => {
  // Define unit types
  const UnitTypes = {
    ITEM: 1,
    SERVICE: 2,
  };

  it("should create a new invoice", async () => {
    // Create a customer
    const [customerResult] = await pool.query(`
      INSERT INTO invoice_manager.customer (name, email, postal_address) VALUES ('Test Customer', 'test@example.com', '123 Test St')
    `);
    const customerId = customerResult.insertId;

    // Create benefits
    const [benefitResult1] = await pool.execute(
      "INSERT INTO invoice_manager.benefit (object, unit, price_per_unit) VALUES (?, ?, ?)",
      ["Benefit 1", UnitTypes.SERVICE, 100.0]
    );

    const benefitId1 = benefitResult1.insertId;

    const [benefitResult2] = await pool.execute(
      "INSERT INTO invoice_manager.benefit (object, unit, price_per_unit) VALUES (?, ?, ?)",
      ["Benefit 2", UnitTypes.ITEM, 50.0]
    );
    const benefitId2 = benefitResult2.insertId;

    const response = await request(app)
      .post("/invoices")
      .send({
        name: "Test Invoice",
        date: "2023-10-01",
        customer_id: customerId,
        benefit_ids: [benefitId1, benefitId2],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("invoiceId");
    expect(response.body.message).toBe("Invoice created successfully");
  });

  it("should retrieve all invoices", async () => {
    const response = await request(app).get("/invoices");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should retrieve an invoice by ID", async () => {
    // Create a customer
    const [customerResult] = await pool.query(`
      INSERT INTO invoice_manager.customer (name, email, postal_address) VALUES ('Invoice Customer', 'invoice@example.com', '456 Invoice Blvd')
    `);
    const customerId = customerResult.insertId;

    // Create a benefit
    const [benefitResult] = await pool.execute(
      "INSERT INTO invoice_manager.benefit (object, unit, price_per_unit) VALUES (?, ?, ?)",
      ["Invoice Benefit", UnitTypes.SERVICE, 200.0]
    );
    const benefitId = benefitResult.insertId;

    // Create an invoice
    const responseCreate = await request(app)
      .post("/invoices")
      .send({
        name: "Invoice for Testing",
        date: "2023-10-02",
        customer_id: customerId,
        benefit_ids: [benefitId],
      });

    const invoiceId = responseCreate.body.invoiceId;

    // Retrieve the invoice
    const response = await request(app).get(`/invoices/${invoiceId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", invoiceId);
    expect(response.body).toHaveProperty("name", "Invoice for Testing");
    expect(response.body.customer).toHaveProperty("id", customerId);
    expect(response.body.benefits).toBeInstanceOf(Array);
    expect(response.body.benefits.length).toBe(1);
    expect(response.body.benefits[0]).toHaveProperty("id", benefitId);
  });

  it("should update an invoice", async () => {
    // Create a customer
    const [customerResult] = await pool.query(`
      INSERT INTO invoice_manager.customer (name, email, postal_address) VALUES ('Update Customer', 'update@example.com', '789 Update Rd')
    `);
    const customerId = customerResult.insertId;

    // Create benefits
    const [benefitResult1] = await pool.execute(
      "INSERT INTO invoice_manager.benefit (object, unit, price_per_unit) VALUES (?, ?, ?)",
      ["Update Benefit 1", UnitTypes.SERVICE, 150.0]
    );
    const benefitId1 = benefitResult1.insertId;

    const [benefitResult2] = await pool.execute(
      "INSERT INTO invoice_manager.benefit (object, unit, price_per_unit) VALUES (?, ?, ?)",
      ["Update Benefit 2", UnitTypes.ITEM, 75.0]
    );
    const benefitId2 = benefitResult2.insertId;

    // Create an invoice
    const responseCreate = await request(app)
      .post("/invoices")
      .send({
        name: "Invoice to Update",
        date: "2023-10-03",
        customer_id: customerId,
        benefit_ids: [benefitId1],
      });

    const invoiceId = responseCreate.body.invoiceId;

    // Update the invoice
    const responseUpdate = await request(app)
      .put(`/invoices/${invoiceId}`)
      .send({
        name: "Updated Invoice",
        date: "2023-10-04",
        customer_id: customerId,
        benefit_ids: [benefitId1, benefitId2],
      });

    expect(responseUpdate.status).toBe(200);
    expect(responseUpdate.body.message).toBe("Invoice updated successfully");

    // Retrieve the invoice to verify updates
    const responseGet = await request(app).get(`/invoices/${invoiceId}`);

    expect(responseGet.status).toBe(200);
    expect(responseGet.body).toHaveProperty("name", "Updated Invoice");
    expect(responseGet.body.benefits.length).toBe(2);
  });

  it("should delete an invoice", async () => {
    // Create a customer
    const [customerResult] = await pool.query(`
      INSERT INTO invoice_manager.customer (name, email, postal_address) VALUES ('Delete Customer', 'delete@example.com', '101 Delete Ln')
    `);
    const customerId = customerResult.insertId;

    // Create a benefit
    const [benefitResult] = await pool.execute(
      "INSERT INTO invoice_manager.benefit (object, unit, price_per_unit) VALUES (?, ?, ?)",
      ["Delete Benefit", UnitTypes.SERVICE, 250.0]
    );
    const benefitId = benefitResult.insertId;

    // Create an invoice
    const responseCreate = await request(app)
      .post("/invoices")
      .send({
        name: "Invoice to Delete",
        date: "2023-10-05",
        customer_id: customerId,
        benefit_ids: [benefitId],
      });

    const invoiceId = responseCreate.body.invoiceId;

    // Delete the invoice
    const responseDelete = await request(app).delete(`/invoices/${invoiceId}`);

    expect(responseDelete.status).toBe(200);
    expect(responseDelete.body.message).toBe("Invoice deleted successfully");

    // Try to retrieve the invoice to confirm deletion
    const responseGet = await request(app).get(`/invoices/${invoiceId}`);

    expect(responseGet.status).toBe(404);
    expect(responseGet.body.message).toBe("Invoice not found");
  });

  it("should return 404 when retrieving a non-existent invoice", async () => {
    const response = await request(app).get("/invoices/999999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Invoice not found");
  });

  it("should return 404 when updating a non-existent invoice", async () => {
    const response = await request(app)
      .put("/invoices/999999")
      .send({
        name: "Non-existent Invoice",
        date: "2023-10-06",
        customer_id: 1,
        benefit_ids: [1],
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Invoice not found");
  });

  it("should return 404 when deleting a non-existent invoice", async () => {
    const response = await request(app).delete("/invoices/999999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Invoice not found");
  });
});
