/**
 * @file controllers/benefits.js
 * @module benefitsController
 * @description Handles benefit-related operations such as creating, retrieving, updating, and deleting benefits.
 */

const pool = require('../../config/database');

/**
 * Creates a new benefit.
 *
 * @async
 * @function createBenefit
 * @memberof module:benefitsController
 * @param {Object} req - The request object containing the benefit data.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.object - The object of the benefit.
 * @param {number} req.body.unit - The unit of the benefit.
 * @param {number} req.body.price_per_unit - The price per unit of the benefit.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with the created benefit ID or an error message.
 */
async function createBenefit(req, res) {
  try {
    const { object, unit, price_per_unit } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO invoice_manager.benefit (object, unit, price_per_unit) VALUES (?, ?, ?)',
      [object, unit, price_per_unit]
    );

    res
      .status(201)
      .json({ id: result.insertId, message: 'Benefit created successfully' });
  } catch (error) {
    console.error('Error creating benefit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.createBenefit = createBenefit;

/**
 * Retrieves benefits by the invoice ID.
 *
 * @async
 * @function getBenefitByInvoiceId
 * @memberof module:benefitsController
 * @param {Object} req - The request object containing the invoice ID.
 * @param {string} req.params.invoiceId - The ID of the invoice.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with the list of benefits or an error message.
 */
async function getBenefitByInvoiceId(req, res) {
  const { invoiceId } = req.params;
  try {
    const [rows] = await pool.query(
      `
        SELECT 
            b.id,
            b.object,
            b.unit,
            b.price_per_unit
        FROM invoice_manager.benefit b
        JOIN invoice_manager.invoice_benefit ib ON b.id = ib.benefit_id
        WHERE ib.invoice_id = ?
      `,
      [invoiceId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'No benefits found for this invoice' });
    }

    res.json(rows);
  } catch (error) {
    console.error('Error retrieving benefits for invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.getBenefitByInvoiceId = getBenefitByInvoiceId;

/**
 * Updates a benefit's details.
 *
 * @async
 * @function updateBenefit
 * @memberof module:benefitsController
 * @param {Object} req - The request object containing the benefit data.
 * @param {string} req.params.id - The ID of the benefit to update.
 * @param {string} req.body.object - The updated object of the benefit.
 * @param {number} req.body.unit - The updated unit of the benefit.
 * @param {number} req.body.price_per_unit - The updated price per unit of the benefit.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response indicating success or failure of the update operation.
 */
async function updateBenefit(req, res) {
  try {
    const { id } = req.params;
    const { object, unit, price_per_unit } = req.body;

    const [result] = await pool.execute(
      'UPDATE invoice_manager.benefit SET object = ?, unit = ?, price_per_unit = ? WHERE id = ?',
      [object, unit, price_per_unit, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Benefit not found' });
    }

    res.status(200).json({ message: 'Benefit updated successfully' });
  } catch (error) {
    console.error('Error updating benefit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.updateBenefit = updateBenefit;

/**
 * Deletes a benefit by its ID.
 *
 * @async
 * @function deleteBenefit
 * @memberof module:benefitsController
 * @param {Object} req - The request object containing the benefit ID.
 * @param {string} req.params.id - The ID of the benefit to delete.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response indicating success or failure of the delete operation.
 */
async function deleteBenefit(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM invoice_manager.benefit WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Benefit not found' });
    }

    res.status(200).json({ message: 'Benefit deleted successfully' });
  } catch (error) {
    console.error('Error deleting benefit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.deleteBenefit = deleteBenefit;
