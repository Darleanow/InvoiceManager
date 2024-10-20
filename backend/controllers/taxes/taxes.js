/**
 * @file controllers/taxes/taxes.js
 * @module taxesController
 * @description Handles tax-related operations including CRUD
 */

const pool = require('../../config/database');

/**
 * Creates a new tax
 * @async
 * @param {Object} req - Request object containing tax data
 * @param {Object} res - Response object
 */
async function createTax(req, res) {
  try {
    const { name, rate, apply_by_default } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO Tax (name, rate, apply_by_default) VALUES (?, ?, ?)`,
      [name, rate, apply_by_default]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Tax created successfully',
    });
  } catch (error) {
    console.error('Error creating tax:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Retrieves a tax by ID
 * @async
 * @param {Object} req - Request object containing tax ID
 * @param {Object} res - Response object
 */
async function getTaxById(req, res) {
  try {
    const { id } = req.params;

    const [taxes] = await pool.execute(`SELECT * FROM Tax WHERE id = ?`, [id]);

    if (taxes.length === 0) {
      return res.status(404).json({ message: 'Tax not found' });
    }

    res.json(taxes[0]);
  } catch (error) {
    console.error('Error retrieving tax:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Updates a tax's details
 * @async
 * @param {Object} req - Request object containing updated tax data
 * @param {Object} res - Response object
 */
async function updateTax(req, res) {
  try {
    const { id } = req.params;
    const { name, rate, apply_by_default } = req.body;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      let updateQuery = `UPDATE Tax SET `;
      const updateParams = [];

      if (name !== undefined) {
        updateQuery += `name = ?, `;
        updateParams.push(name);
      }
      if (rate !== undefined) {
        updateQuery += `rate = ?, `;
        updateParams.push(rate);
      }
      if (apply_by_default !== undefined) {
        updateQuery += `apply_by_default = ?, `;
        updateParams.push(apply_by_default);
      }

      updateQuery = updateQuery.slice(0, -2);
      updateQuery += ` WHERE id = ?`;
      updateParams.push(id);

      if (updateParams.length > 1) {
        const [result] = await connection.execute(updateQuery, updateParams);

        if (result.affectedRows === 0) {
          await connection.rollback();
          return res.status(404).json({ message: 'Tax not found' });
        }
      }

      await connection.commit();
      res.json({ message: 'Tax updated successfully' });
    } catch (error) {
      await connection.rollback();
      console.error('Error updating tax:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating tax:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Deletes a tax by ID
 * @async
 * @param {Object} req - Request object containing tax ID
 * @param {Object} res - Response object
 */
async function deleteTax(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(`DELETE FROM Tax WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tax not found' });
    }

    res.json({ message: 'Tax deleted successfully' });
  } catch (error) {
    console.error('Error deleting tax:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Lists all taxes
 * @async
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function listTaxes(req, res) {
  try {
    const [taxes] = await pool.execute(
      `SELECT * FROM Tax ORDER BY created_at DESC`
    );

    res.json({
      data: taxes,
    });
  } catch (error) {
    console.error('Error listing taxes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createTax,
  getTaxById,
  updateTax,
  deleteTax,
  listTaxes,
};
