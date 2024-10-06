/**
 * @file controllers/invoices.js
 * @module invoicesController
 * @description Handles invoice-related operations such as creating, retrieving, updating, and deleting invoices.
 */

const pool = require("../../config/database");

/**
 * Creates a new invoice and associates it with a customer and multiple benefits.
 *
 * @async
 * @function createInvoice
 * @memberof module:invoicesController
 * @param {Object} req - The request object containing the invoice data.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.name - The name of the invoice.
 * @param {string} req.body.date - The date of the invoice.
 * @param {number} req.body.customer_id - The ID of the customer associated with the invoice.
 * @param {number[]} req.body.benefit_ids - An array of benefit IDs associated with the invoice.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with the created invoice ID or an error message.
 */
async function createInvoice(req, res) {
  const { name, date, customer_id, benefit_ids } = req.body;

  if (
    !name ||
    !date ||
    !customer_id ||
    !benefit_ids ||
    benefit_ids.length === 0
  ) {
    return res.status(400).json({
      message:
        "Invoice name, date, customer ID, and at least one benefit ID are required",
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [invoiceResult] = await connection.query(
      "INSERT INTO invoice_manager.invoice (name, date) VALUES (?, ?)",
      [name, date]
    );
    const invoice_id = invoiceResult.insertId;

    await connection.query(
      "INSERT INTO invoice_manager.customer_invoice (customer_id, invoice_id) VALUES (?, ?)",
      [customer_id, invoice_id]
    );

    for (const benefit_id of benefit_ids) {
      await connection.query(
        "INSERT INTO invoice_manager.invoice_benefit (invoice_id, benefit_id) VALUES (?, ?)",
        [invoice_id, benefit_id]
      );
    }

    await connection.commit();
    res
      .status(201)
      .json({ message: "Invoice created successfully", invoiceId: invoice_id });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: "Database error", error: err });
  } finally {
    connection.release();
  }
}

exports.createInvoice = createInvoice;

/**
 * Retrieves all invoices along with their associated customers and benefits.
 *
 * @async
 * @function getInvoices
 * @memberof module:invoicesController
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with all invoices or an error message.
 */
async function getInvoices(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT 
          i.id,
          i.name,
          i.date,
          c.id AS customer_id,
          c.name AS customer_name,
          c.email AS customer_email,
          c.postal_address,
          b.id AS benefit_id,
          b.object AS benefit_object,
          b.unit AS benefit_unit,
          b.price_per_unit
      FROM invoice_manager.invoice i
      JOIN invoice_manager.customer_invoice ci ON i.id = ci.invoice_id
      JOIN invoice_manager.customer c ON ci.customer_id = c.id
      JOIN invoice_manager.invoice_benefit ib ON i.id = ib.invoice_id
      JOIN invoice_manager.benefit b ON ib.benefit_id = b.id
    `);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No invoices found" });
    }

    const invoicesMap = new Map();

    rows.forEach((row) => {
      if (!invoicesMap.has(row.id)) {
        invoicesMap.set(row.id, {
          id: row.id,
          name: row.name,
          date: row.date,
          customer: {
            id: row.customer_id,
            name: row.customer_name,
            email: row.customer_email,
            postal_address: row.postal_address,
          },
          benefits: [],
        });
      }

      invoicesMap.get(row.id).benefits.push({
        id: row.benefit_id,
        object: row.benefit_object,
        unit: row.benefit_unit,
        price_per_unit: row.price_per_unit,
      });
    });

    const invoices = Array.from(invoicesMap.values());

    res.status(200).json(invoices);
  } catch (err) {
    console.error("Error retrieving invoices:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
}

exports.getInvoices = getInvoices;

/**
 * Retrieves a single invoice by its ID, along with the associated customer and benefits.
 *
 * @async
 * @function getInvoiceById
 * @memberof module:invoicesController
 * @param {Object} req - The request object containing the invoice ID.
 * @param {string} req.params.id - The ID of the invoice.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with the invoice details or an error message.
 */
async function getInvoiceById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `
      SELECT 
          i.id,
          i.name,
          i.date,
          c.id AS customer_id,
          c.name AS customer_name,
          c.email AS customer_email,
          c.postal_address,
          b.id AS benefit_id,
          b.object AS benefit_object,
          b.unit AS benefit_unit,
          b.price_per_unit
      FROM invoice_manager.invoice i
      JOIN invoice_manager.customer_invoice ci ON i.id = ci.invoice_id
      JOIN invoice_manager.customer c ON ci.customer_id = c.id
      JOIN invoice_manager.invoice_benefit ib ON i.id = ib.invoice_id
      JOIN invoice_manager.benefit b ON ib.benefit_id = b.id
      WHERE i.id = ?
    `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const invoice = {
      id: rows[0].id,
      name: rows[0].name,
      date: rows[0].date,
      customer: {
        id: rows[0].customer_id,
        name: rows[0].customer_name,
        email: rows[0].customer_email,
        postal_address: rows[0].postal_address,
      },
      benefits: rows.map((row) => ({
        id: row.benefit_id,
        object: row.benefit_object,
        unit: row.benefit_unit,
        price_per_unit: row.price_per_unit,
      })),
    };

    res.status(200).json(invoice);
  } catch (err) {
    console.error("Error retrieving invoice:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
}

exports.getInvoiceById = getInvoiceById;

/**
 * Updates an invoice's details, including its associated customer and benefits.
 *
 * @async
 * @function updateInvoice
 * @memberof module:invoicesController
 * @param {Object} req - The request object containing the updated invoice data.
 * @param {string} req.params.id - The ID of the invoice to update.
 * @param {string} req.body.name - The new name of the invoice.
 * @param {string} req.body.date - The new date of the invoice.
 * @param {number} req.body.customer_id - The updated customer ID.
 * @param {number[]} req.body.benefit_ids - The updated list of benefit IDs.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response indicating success or failure of the update operation.
 */
async function updateInvoice(req, res) {
  const { id } = req.params;
  const { name, date, customer_id, benefit_ids } = req.body;

  if (
    !name ||
    !date ||
    !customer_id ||
    !benefit_ids ||
    benefit_ids.length === 0
  ) {
    return res.status(400).json({
      message:
        "Invoice name, date, customer ID, and at least one benefit ID are required",
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      "UPDATE invoice_manager.invoice SET name = ?, date = ? WHERE id = ?",
      [name, date, id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Invoice not found" });
    }

    await connection.query(
      "UPDATE invoice_manager.customer_invoice SET customer_id = ? WHERE invoice_id = ?",
      [customer_id, id]
    );

    await connection.query(
      "DELETE FROM invoice_manager.invoice_benefit WHERE invoice_id = ?",
      [id]
    );
    for (const benefit_id of benefit_ids) {
      await connection.query(
        "INSERT INTO invoice_manager.invoice_benefit (invoice_id, benefit_id) VALUES (?, ?)",
        [id, benefit_id]
      );
    }

    await connection.commit();
    res.status(200).json({ message: "Invoice updated successfully" });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: "Database error", error: err });
  } finally {
    connection.release();
  }
}

exports.updateInvoice = updateInvoice;

/**
 * Deletes an invoice, along with its associated customer and benefit records.
 *
 * @async
 * @function deleteInvoice
 * @memberof module:invoicesController
 * @param {Object} req - The request object containing the invoice ID.
 * @param {string} req.params.id - The ID of the invoice to delete.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response indicating success or failure of the delete operation.
 */
async function deleteInvoice(req, res) {
  const { id } = req.params;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      "DELETE FROM invoice_manager.invoice_benefit WHERE invoice_id = ?",
      [id]
    );
    await connection.query(
      "DELETE FROM invoice_manager.customer_invoice WHERE invoice_id = ?",
      [id]
    );

    const [result] = await connection.query(
      "DELETE FROM invoice_manager.invoice WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Invoice not found" });
    }

    await connection.commit();
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: "Database error", error: err });
  } finally {
    connection.release();
  }
}

exports.deleteInvoice = deleteInvoice;
