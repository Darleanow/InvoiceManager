/**
 * @file controllers/items/items.js
 * @module itemsController
 * @description Handles item-related operations including CRUD
 */

const {
  createEntity,
  getEntityById,
  updateEntity,
  deleteEntity,
} = require('../utils/utils');
const pool = require('../../config/database');

const TABLE_NAME = 'Item';

/**
 * Creates a new item
 * @async
 * @param {Object} req - Request object containing item data
 * @param {Object} res - Response object
 */
async function createItem(req, res) {
  const { name, description, default_price, type, image } = req.body;
  await createEntity({
    tableName: TABLE_NAME,
    data: {
      name,
      description,
      default_price,
      type,
      image: image || null,
    },
    res,
  });
}

/**
 * Retrieves an item by ID
 * @async
 * @param {Object} req - Request object containing item ID
 * @param {Object} res - Response object
 */
async function getItemById(req, res) {
  await getEntityById({
    tableName: TABLE_NAME,
    id: req.params.id,
    res,
  });
}

/**
 * Updates an item's details
 * @async
 * @param {Object} req - Request object containing updated item data
 * @param {Object} res - Response object
 */
async function updateItem(req, res) {
  const { name, description, default_price, type, image, is_active } = req.body;
  await updateEntity({
    tableName: TABLE_NAME,
    id: req.params.id,
    data: { name, description, default_price, type, image, is_active },
    res,
  });
}

/**
 * Deletes an item by ID
 * @async
 * @param {Object} req - Request object containing item ID
 * @param {Object} res - Response object
 */
async function deleteItem(req, res) {
  await deleteEntity({
    tableName: TABLE_NAME,
    id: req.params.id,
    res,
  });
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
