/**
 * @file controllers/utils/utils.js
 * @module controllerUtils
 * @description Utility functions for controller operations with user access control
 */

const pool = require('../../config/database');

/**
 * Executes a CREATE operation for any entity with user association
 * @async
 * @param {Object} params - Parameters for the create operation
 * @param {string} params.tableName - Name of the table to insert into
 * @param {Object} params.data - Key-value pairs of data to insert
 * @param {Object} params.res - Response object
 * @param {Object} params.user - User object from request
 * @param {string} [params.userIdField='created_by_user_id'] - Name of the user ID field in the table
 * @returns {Promise<void>}
 */
async function createEntity({
  tableName,
  data,
  res,
  user,
  userIdField = 'created_by_user_id',
}) {
  if (!user?.id) {
    return res.status(401).json({ error: 'User authentication required' });
  }

  try {
    // Add user ID to data
    const dataWithUser = {
      ...data,
      [userIdField]: user.id,
    };

    const columns = Object.keys(dataWithUser).join(', ');
    const placeholders = Object.keys(dataWithUser)
      .map(() => '?')
      .join(', ');
    const values = Object.values(dataWithUser);

    const [result] = await pool.execute(
      `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`,
      values
    );

    res.status(201).json({
      id: result.insertId,
      message: `${tableName} created successfully`,
    });
  } catch (error) {
    console.error(`Error creating ${tableName}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Retrieves an entity by ID with user access check
 * @async
 * @param {Object} params - Parameters for the get operation
 * @param {string} params.tableName - Name of the table to query
 * @param {number|string} params.id - ID of the entity to retrieve
 * @param {Object} params.res - Response object
 * @param {Object} params.user - User object from request
 * @param {string} [params.userIdField='created_by_user_id'] - Name of the user ID field in the table
 * @param {string[]} [params.selectFields] - Specific fields to select, defaults to all
 * @returns {Promise<void>}
 */
async function getEntityById({
  tableName,
  id,
  res,
  user,
  userIdField = 'created_by_user_id',
  selectFields = ['*'],
}) {
  if (!user?.id) {
    return res.status(401).json({ error: 'User authentication required' });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT ${selectFields.join(', ')} FROM ${tableName} 
       WHERE id = ? AND ${userIdField} = ?`,
      [id, user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: `${tableName} not found` });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(`Error retrieving ${tableName}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Updates an entity's details with user access check
 * @async
 * @param {Object} params - Parameters for the update operation
 * @param {string} params.tableName - Name of the table to update
 * @param {number|string} params.id - ID of the entity to update
 * @param {Object} params.data - Key-value pairs of data to update
 * @param {Object} params.res - Response object
 * @param {Object} params.user - User object from request
 * @param {string} [params.userIdField='created_by_user_id'] - Name of the user ID field in the table
 * @returns {Promise<void>}
 */
async function updateEntity({
  tableName,
  id,
  data,
  res,
  user,
  userIdField = 'created_by_user_id',
}) {
  if (!user?.id) {
    return res.status(401).json({ error: 'User authentication required' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // First check if the entity belongs to the user
    const [checkRow] = await connection.execute(
      `SELECT id FROM ${tableName} WHERE id = ? AND ${userIdField} = ?`,
      [id, user.id]
    );

    if (checkRow.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: `${tableName} not found` });
    }

    let updateQuery = `UPDATE ${tableName} SET `;
    const updateParams = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updateQuery += `${key} = ?, `;
        updateParams.push(value);
      }
    });

    if (updateParams.length > 0) {
      updateQuery = updateQuery.slice(0, -2);
      updateQuery += ` WHERE id = ? AND ${userIdField} = ?`;
      updateParams.push(id, user.id);

      const [result] = await connection.execute(updateQuery, updateParams);

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ message: `${tableName} not found` });
      }
    }

    await connection.commit();
    res.json({ message: `${tableName} updated successfully` });
  } catch (error) {
    await connection.rollback();
    console.error(`Error updating ${tableName}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
}

/**
 * Deletes an entity by ID with user access check
 * @async
 * @param {Object} params - Parameters for the delete operation
 * @param {string} params.tableName - Name of the table to delete from
 * @param {number|string} params.id - ID of the entity to delete
 * @param {Object} params.res - Response object
 * @param {Object} params.user - User object from request
 * @param {string} [params.userIdField='created_by_user_id'] - Name of the user ID field in the table
 * @returns {Promise<void>}
 */
async function deleteEntity({
  tableName,
  id,
  res,
  user,
  userIdField = 'created_by_user_id',
}) {
  if (!user?.id) {
    return res.status(401).json({ error: 'User authentication required' });
  }

  try {
    const [result] = await pool.execute(
      `DELETE FROM ${tableName} WHERE id = ? AND ${userIdField} = ?`,
      [id, user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `${tableName} not found` });
    }

    res.json({ message: `${tableName} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting ${tableName}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Lists entities with optional filtering and user access check
 * @async
 * @param {Object} params - Parameters for the list operation
 * @param {string} params.tableName - Name of the table to query
 * @param {Object} params.res - Response object
 * @param {Object} params.user - User object from request
 * @param {Object} [params.filters={}] - Key-value pairs for WHERE conditions
 * @param {string} [params.orderBy='created_at DESC'] - ORDER BY clause
 * @param {string} [params.userIdField='created_by_user_id'] - Name of the user ID field in the table
 * @param {string[]} [params.selectFields] - Specific fields to select, defaults to all
 * @returns {Promise<void>}
 */
async function listEntities({
  tableName,
  res,
  user,
  filters = {},
  orderBy = 'created_at DESC',
  userIdField = 'created_by_user_id',
  selectFields = ['*'],
}) {
  if (!user?.id) {
    return res.status(401).json({ error: 'User authentication required' });
  }

  try {
    let query = `SELECT ${selectFields.join(', ')} FROM ${tableName} WHERE ${userIdField} = ?`;
    const params = [user.id];

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        query += ` AND ${key} = ?`;
        params.push(value);
      }
    });

    query += ` ORDER BY ${orderBy}`;

    const [rows] = await pool.execute(query, params);

    res.json({
      data: rows,
    });
  } catch (error) {
    console.error(`Error listing ${tableName}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createEntity,
  getEntityById,
  updateEntity,
  deleteEntity,
  listEntities,
};
