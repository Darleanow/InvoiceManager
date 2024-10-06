const pool = require("../../config/database");
const customersController = require("./customers");

jest.mock("../../config/database");

describe("Customers Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createCustomer should return 201 and success message", async () => {
    const req = {
      body: {
        customer_name: "Jane Doe",
        customer_email: "jane@example.com",
        postal_address: "456 Park Ave",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockResolvedValue([{ insertId: 1 }]);

    await customersController.createCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      message: "Customer created successfully",
    });
  });

  test("createCustomer should return 500 on database error", async () => {
    const req = {
      body: {
        customer_name: "Jane Doe",
        customer_email: "jane@example.com",
        postal_address: "456 Park Ave",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockRejectedValue(new Error("Database error"));

    await customersController.createCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  test("getCustomers should return customers", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.query.mockResolvedValue([
      [
        {
          customer_id: 1,
          customer_name: "Jane Doe",
          customer_email: "jane@example.com",
          postal_address: "456 Park Ave",
        },
      ],
    ]);

    await customersController.getCustomers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          customer_id: 1,
          customer_name: "Jane Doe",
          customer_email: "jane@example.com",
          postal_address: "456 Park Ave",
        }),
      ])
    );
  });

  test("getCustomers should return 500 on error", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.query.mockRejectedValue(new Error("Database error"));

    await customersController.getCustomers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  test("getCustomerById should return customer details", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.query.mockResolvedValue([
      [
        {
          customer_id: 1,
          customer_name: "Jane Doe",
          customer_email: "jane@example.com",
          postal_address: "456 Park Ave",
        },
      ],
    ]);

    await customersController.getCustomerById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_id: 1,
        customer_name: "Jane Doe",
        customer_email: "jane@example.com",
        postal_address: "456 Park Ave",
      })
    );
  });

  test("getCustomerById should return 404 if customer not found", async () => {
    const req = { params: { id: 999 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.query.mockResolvedValue([[]]);

    await customersController.getCustomerById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Customer not found" });
  });

  test("getCustomerById should return 500 on database error", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.query.mockRejectedValue(new Error("Database error"));

    await customersController.getCustomerById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  test("updateCustomer should return 200 on success", async () => {
    const req = {
      params: { id: 1 },
      body: {
        customer_name: "Updated Name",
        customer_email: "updated@example.com",
        postal_address: "789 New St",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockResolvedValue([{ affectedRows: 1 }]);

    await customersController.updateCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Customer updated successfully",
    });
  });

  test("updateCustomer should return 404 if customer not found", async () => {
    const req = {
      params: { id: 999 },
      body: {
        customer_name: "Non-existent Customer",
        customer_email: "nonexistent@example.com",
        postal_address: "No Address",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockResolvedValue([{ affectedRows: 0 }]);

    await customersController.updateCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Customer not found" });
  });

  test("updateCustomer should return 500 on database error", async () => {
    const req = {
      params: { id: 1 },
      body: {
        customer_name: "Updated Name",
        customer_email: "updated@example.com",
        postal_address: "789 New St",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockRejectedValue(new Error("Database error"));

    await customersController.updateCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  test("deleteCustomer should return 200 on success", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockResolvedValue([{ affectedRows: 1 }]);

    await customersController.deleteCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Customer deleted successfully",
    });
  });

  test("deleteCustomer should return 404 if customer not found", async () => {
    const req = { params: { id: 999 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockResolvedValue([{ affectedRows: 0 }]);

    await customersController.deleteCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Customer not found" });
  });

  test("deleteCustomer should return 500 on database error", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockRejectedValue(new Error("Database error"));

    await customersController.deleteCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
