/**
 * @file controllers/benefits.test.js
 * @description Unit tests for the Benefits Controller.
 */

const pool = require("../../config/database");
const benefitsController = require("./benefits");

jest.mock("../../config/database");

describe("Benefits Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createBenefit should return 201 and success message", async () => {
    const req = {
      body: {
        object: "Health Insurance",
        unit: 12,
        price_per_unit: 100,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockResolvedValue([{ insertId: 1 }]);

    await benefitsController.createBenefit(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      message: "Benefit created successfully",
    });
  });

  test("createBenefit should return 500 on database error", async () => {
    const req = {
      body: {
        object: "Health Insurance",
        unit: 12,
        price_per_unit: 100,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockRejectedValue(new Error("Database error"));

    await benefitsController.createBenefit(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  test("getBenefitByInvoiceId should return benefits", async () => {
    const req = { params: { invoiceId: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.query.mockResolvedValue([
      [{ id: 1, object: "Health Insurance", unit: 12, price_per_unit: 100 }],
    ]);

    await benefitsController.getBenefitByInvoiceId(req, res);

    expect(res.json).toHaveBeenCalledWith([
      { id: 1, object: "Health Insurance", unit: 12, price_per_unit: 100 },
    ]);
  });

  test("getBenefitByInvoiceId should return 404 if no benefits found", async () => {
    const req = { params: { invoiceId: 999 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.query.mockResolvedValue([[]]);

    await benefitsController.getBenefitByInvoiceId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "No benefits found for this invoice",
    });
  });

  test("getBenefitByInvoiceId should return 500 on database error", async () => {
    const req = { params: { invoiceId: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.query.mockRejectedValue(new Error("Database error"));

    await benefitsController.getBenefitByInvoiceId(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  test("updateBenefit should return 200 on success", async () => {
    const req = {
      params: { id: 1 },
      body: {
        object: "Updated Benefit",
        unit: 15,
        price_per_unit: 200,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockResolvedValue([{ affectedRows: 1 }]);

    await benefitsController.updateBenefit(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Benefit updated successfully",
    });
  });

  test("updateBenefit should return 404 if benefit not found", async () => {
    const req = { params: { id: 999 }, body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockResolvedValue([{ affectedRows: 0 }]);

    await benefitsController.updateBenefit(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Benefit not found" });
  });

  test("updateBenefit should return 500 on database error", async () => {
    const req = {
      params: { id: 1 },
      body: {
        object: "Updated Benefit",
        unit: 15,
        price_per_unit: 200,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockRejectedValue(new Error("Database error"));

    await benefitsController.updateBenefit(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  test("deleteBenefit should return 200 on success", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockResolvedValue([{ affectedRows: 1 }]);

    await benefitsController.deleteBenefit(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Benefit deleted successfully",
    });
  });

  test("deleteBenefit should return 404 if benefit not found", async () => {
    const req = { params: { id: 999 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockResolvedValue([{ affectedRows: 0 }]);

    await benefitsController.deleteBenefit(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Benefit not found" });
  });

  test("deleteBenefit should return 500 on database error", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.execute.mockRejectedValue(new Error("Database error"));

    await benefitsController.deleteBenefit(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
