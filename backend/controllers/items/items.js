/**
 * @file controllers/items/items.js
 * @module itemsController
 * @description Handles item-related operations including CRUD
 */

const pool = require('../../config/database');

/**
 * Creates a new item
 * @async
 * @param {Object} req - Request object containing item data
 * @param {Object} res - Response object
 */
async function createItem(req, res) {
  try {
    const { name, description, default_price, type, image } = req.body;

    const itemImage = image || null;

    const [result] = await pool.execute(
      `INSERT INTO Item (name, description, default_price, type, image)
       VALUES (?, ?, ?, ?, ?)`,
      [name, description, default_price, type, itemImage]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Item created successfully',
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Retrieves an item by ID
 * @async
 * @param {Object} req - Request object containing item ID
 * @param {Object} res - Response object
 */
async function getItemById(req, res) {
  try {
    const { id } = req.params;

    const [items] = await pool.execute(`SELECT * FROM Item WHERE id = ?`, [id]);

    if (items.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(items[0]);
  } catch (error) {
    console.error('Error retrieving item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Updates an item's details
 * @async
 * @param {Object} req - Request object containing updated item data
 * @param {Object} res - Response object
 */
async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const { name, description, default_price, type, image, is_active } =
      req.body;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      let updateQuery = `UPDATE Item SET `;
      const updateParams = [];

      if (name !== undefined) {
        updateQuery += `name = ?, `;
        updateParams.push(name);
      }
      if (description !== undefined) {
        updateQuery += `description = ?, `;
        updateParams.push(description);
      }
      if (default_price !== undefined) {
        updateQuery += `default_price = ?, `;
        updateParams.push(default_price);
      }
      if (type !== undefined) {
        updateQuery += `type = ?, `;
        updateParams.push(type);
      }
      if (image !== undefined) {
        updateQuery += `image = ?, `;
        updateParams.push(image);
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
          return res.status(404).json({ message: 'Item not found' });
        }
      }

      await connection.commit();
      res.json({ message: 'Item updated successfully' });
    } catch (error) {
      await connection.rollback();
      console.error('Error updating item:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Deletes an item by ID
 * @async
 * @param {Object} req - Request object containing item ID
 * @param {Object} res - Response object
 */
async function deleteItem(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(`DELETE FROM Item WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Lists all items with filtering and pagination
 * @async
 * @param {Object} req - Request object containing filter parameters
 * @param {Object} res - Response object
 */
async function listItems(req, res) {
  try {
    const { type, is_active, search } = req.query;

    let baseQuery = `
      SELECT *
      FROM Item
      WHERE 1=1
    `;

    const params = [];

    if (type) {
      baseQuery += ' AND type = ?';
      params.push(type);
    }

    if (is_active !== undefined) {
      baseQuery += ' AND is_active = ?';
      params.push(is_active);
    }

    if (search) {
      baseQuery += ` AND (
        name LIKE ? OR 
        description LIKE ?
      )`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam);
    }

    baseQuery += ' ORDER BY created_at DESC';

    const [items] = await pool.execute(baseQuery, params);

    res.json({
      data: items,
    });
  } catch (error) {
    console.error('Error listing items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createItem,
  getItemById,
  updateItem,
  deleteItem,
  listItems,
};
