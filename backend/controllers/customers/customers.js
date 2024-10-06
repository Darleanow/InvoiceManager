/**
 * @file controllers/customers.js
 * @description Handles customer-related operations such as creating, retrieving, updating, and deleting customers.
 */

const pool = require("../../config/database");

/**
 * Creates a new customer.
 *
 * @async
 * @function
 * @param {Object} req - The request object containing the customer data.
 * @param {string} req.body.customer_name - The name of the customer.
 * @param {string} req.body.customer_email - The email of the customer.
 * @param {string} req.body.postal_address - The postal address of the customer.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with the created customer ID or an error message.
 */
exports.createCustomer = async (req, res) => {
  try {
    const { customer_name, customer_email, postal_address } = req.body;

    const [result] = await pool.execute(
      "INSERT INTO invoice_manager.customer (customer_name, customer_email, postal_address) VALUES (?, ?, ?)",
      [customer_name, customer_email, postal_address]
    );

    res
      .status(201)
      .json({ id: result.insertId, message: "Customer created successfully" });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Retrieves all customers.
 *
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with the list of all customers or an error message.
 */
exports.getCustomers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM invoice_manager.customer");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error retrieving customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Retrieves a customer by their ID.
 *
 * @async
 * @function
 * @param {Object} req - The request object containing the customer ID.
 * @param {string} req.params.id - The ID of the customer to retrieve.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with the customer details or an error message.
 */
exports.getCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM invoice_manager.customer WHERE customer_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error retrieving customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Updates a customer's details.
 *
 * @async
 * @function
 * @param {Object} req - The request object containing the updated customer data.
 * @param {string} req.params.id - The ID of the customer to update.
 * @param {string} req.body.customer_name - The updated name of the customer.
 * @param {string} req.body.customer_email - The updated email of the customer.
 * @param {string} req.body.postal_address - The updated postal address of the customer.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response indicating success or failure of the update operation.
 */
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { customer_name, customer_email, postal_address } = req.body;

  try {
    const [result] = await pool.execute(
      "UPDATE invoice_manager.customer SET customer_name = ?, customer_email = ?, postal_address = ? WHERE customer_id = ?",
      [customer_name, customer_email, postal_address, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Deletes a customer by their ID.
 *
 * @async
 * @function
 * @param {Object} req - The request object containing the customer ID.
 * @param {string} req.params.id - The ID of the customer to delete.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response indicating success or failure of the delete operation.
 */
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute(
      "DELETE FROM invoice_manager.customer WHERE customer_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
