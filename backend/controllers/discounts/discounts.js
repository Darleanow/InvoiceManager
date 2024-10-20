/**
 * @file controllers/discounts/discounts.js
 * @module discountsController
 * @description Handles discount-related operations including CRUD
 */

const pool = require('../../config/database');

/**
 * Creates a new discount
 * @async
 * @param {Object} req - Request object containing discount data
 * @param {Object} res - Response object
 */
async function createDiscount(req, res) {
  try {
    const { name, type, value, is_active } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO Discount (name, type, value, is_active) VALUES (?, ?, ?, ?)`,
      [name, type, value, is_active]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Discount created successfully',
    });
  } catch (error) {
    console.error('Error creating discount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Retrieves a discount by ID
 * @async
 * @param {Object} req - Request object containing discount ID
 * @param {Object} res - Response object
 */
async function getDiscountById(req, res) {
  try {
    const { id } = req.params;

    const [discounts] = await pool.execute(
      `SELECT * FROM Discount WHERE id = ?`,
      [id]
    );

    if (discounts.length === 0) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    res.json(discounts[0]);
  } catch (error) {
    console.error('Error retrieving discount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Updates a discount's details
 * @async
 * @param {Object} req - Request object containing updated discount data
 * @param {Object} res - Response object
 */
async function updateDiscount(req, res) {
  try {
    const { id } = req.params;
    const { name, type, value, is_active } = req.body;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      let updateQuery = `UPDATE Discount SET `;
      const updateParams = [];

      if (name !== undefined) {
        updateQuery += `name = ?, `;
        updateParams.push(name);
      }
      if (type !== undefined) {
        updateQuery += `type = ?, `;
        updateParams.push(type);
      }
      if (value !== undefined) {
        updateQuery += `value = ?, `;
        updateParams.push(value);
      }
      if (is_active !== undefined) {
        updateQuery += `is_active = ?, `;
        updateParams.push(is_active);
      }

      updateQuery = updateQuery.slice(0, -2);
      updateQuery += ` WHERE id = ?`;
      updateParams.push(id);

      if (updateParams.length > 1) {
        const [result] = await connection.execute(updateQuery, updateParams);

        if (result.affectedRows === 0) {
          await connection.rollback();
          return res.status(404).json({ message: 'Discount not found' });
        }
      }

      await connection.commit();
      res.json({ message: 'Discount updated successfully' });
    } catch (error) {
      await connection.rollback();
      console.error('Error updating discount:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating discount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Deletes a discount by ID
 * @async
 * @param {Object} req - Request object containing discount ID
 * @param {Object} res - Response object
 */
async function deleteDiscount(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(`DELETE FROM Discount WHERE id = ?`, [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    res.json({ message: 'Discount deleted successfully' });
  } catch (error) {
    console.error('Error deleting discount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Lists all discounts
 * @async
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function listDiscounts(req, res) {
  try {
    const [discounts] = await pool.execute(
      `SELECT * FROM Discount ORDER BY created_at DESC`
    );

    res.json({
      data: discounts,
    });
  } catch (error) {
    console.error('Error listing discounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createDiscount,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  listDiscounts,
};
