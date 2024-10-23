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
    user: req.user,
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
    user: req.user,
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
    user: req.user,
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
    user: req.user,
  });
}

/**
 * Lists all items with filtering and pagination
 * @async
 * @param {Object} req - Request object containing filter parameters
 * @param {Object} res - Response object
 */
async function listItems(req, res) {
  const { type, is_active, search } = req.query;
  let filters = {};

  if (type) filters.type = type;
  if (is_active !== undefined) filters.is_active = is_active;

  if (!search) {
    await listEntities({
      tableName: TABLE_NAME,
      res,
      user: req.user,
      filters,
    });
    return;
  }

  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    let baseQuery = `
      SELECT *
      FROM ${TABLE_NAME}
      WHERE created_by_user_id = ?
      ${type ? 'AND type = ?' : ''}
      ${is_active !== undefined ? 'AND is_active = ?' : ''}
      AND (name LIKE ? OR description LIKE ?)
      ORDER BY created_at DESC
    `;

    const params = [req.user.id];
    if (type) params.push(type);
    if (is_active !== undefined) params.push(is_active);

    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam);

    const [items] = await pool.execute(baseQuery, params);
    res.json({ data: items });
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
