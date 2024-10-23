/**
 * @file controllers/clients.js
 * @module clientController
 * @description Handles client-related operations including CRUD
 */

const { deleteEntity } = require('../utils/utils');
const pool = require('../../config/database');

const TABLE_NAME = 'Client';

/**
 * Creates a new client
 * @async
 * @param {Object} req - Request object containing client data
 * @param {Object} res - Response object
 */
async function createClient(req, res) {
  try {
    const {
      email,
      phone,
      type,
      address,
      image,
      first_name,
      last_name,
      company_name,
    } = req.body;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [clientResult] = await connection.execute(
        `INSERT INTO Client (email, phone, type, address, image)
         VALUES (?, ?, ?, ?, ?)`,
        [
          email || null,
          phone || null,
          type || null,
          address || null,
          image || null,
        ]
      );

      const client_id = clientResult.insertId;

      if (type === 'individual') {
        await connection.execute(
          `INSERT INTO Client_Individual (client_id, first_name, last_name)
           VALUES (?, ?, ?)`,
          [client_id, first_name || null, last_name || null]
        );
      } else if (type === 'company') {
        await connection.execute(
          `INSERT INTO Client_Company (client_id, company_name)
           VALUES (?, ?)`,
          [client_id, company_name || null]
        );
      } else {
        throw new Error('Invalid client type');
      }

      await connection.commit();
      res.status(201).json({
        id: client_id,
        message: 'Client created successfully',
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Retrieves a client by ID with all related information
 * @async
 * @param {Object} req - Request object containing client ID
 * @param {Object} res - Response object
 */
async function getClientById(req, res) {
  try {
    const { id } = req.params;

    if (id === undefined) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    const [clients] = await pool.execute(
      `SELECT 
        c.*,
        CASE 
          WHEN c.type = 'individual' THEN JSON_OBJECT(
            'first_name', ci.first_name,
            'last_name', ci.last_name
          )
          WHEN c.type = 'company' THEN JSON_OBJECT(
            'company_name', cc.company_name
          )
          ELSE NULL
        END as details
      FROM Client c
      LEFT JOIN Client_Individual ci ON c.id = ci.client_id
      LEFT JOIN Client_Company cc ON c.id = cc.client_id
      WHERE c.id = ?`,
      [id]
    );

    if (clients.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(clients[0]);
  } catch (error) {
    console.error('Error retrieving client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Updates main client data in the database
 * @async
 * @param {Object} connection - Database connection object
 * @param {string|number} id - Client ID
 * @param {Object} mainClientData - Object containing client data fields
 * @param {string} [mainClientData.email] - Client's email
 * @param {string} [mainClientData.phone] - Client's phone number
 * @param {string} [mainClientData.address] - Client's address
 * @param {string} [mainClientData.image] - Client's image URL
 * @param {boolean} [mainClientData.is_active] - Client's active status
 * @returns {Promise<boolean>} Returns true if update successful, false if client not found
 */
async function updateMainClientData(connection, id, mainClientData) {
  const { updateQuery, updateParams } = buildUpdateQuery(
    'Client',
    mainClientData,
    id
  );

  if (updateParams.length > 0) {
    const [clientResult] = await connection.execute(updateQuery, updateParams);
    if (clientResult.affectedRows === 0) {
      return false;
    }
  }
  return true;
}

/**
 * Builds a parameterized UPDATE query for the specified table
 * @param {string} table - Name of the table to update
 * @param {Object} data - Object containing field-value pairs to update
 * @param {string|number} id - ID of the record to update
 * @returns {Object} Object containing the query string and parameters array
 * @property {string} updateQuery - The prepared UPDATE query string
 * @property {Array} updateParams - Array of parameters for the query
 */
function buildUpdateQuery(table, data, id) {
  let updateQuery = `UPDATE ${table} SET `;
  const updateParams = [];

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      updateQuery += `${key} = ?, `;
      updateParams.push(value);
    }
  });

  if (updateParams.length > 0) {
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ` WHERE ${table === 'Client' ? 'id' : 'client_id'} = ?`;
    updateParams.push(id);
  }

  return { updateQuery, updateParams };
}

/**
 * Updates individual client specific data
 * @async
 * @param {Object} connection - Database connection object
 * @param {string|number} id - Client ID
 * @param {Object} data - Individual client data
 * @param {string} [data.first_name] - Individual's first name
 * @param {string} [data.last_name] - Individual's last name
 * @returns {Promise<void>}
 */
async function updateIndividualClient(
  connection,
  id,
  { first_name, last_name }
) {
  const individualData = { first_name, last_name };
  const { updateQuery, updateParams } = buildUpdateQuery(
    'Client_Individual',
    individualData,
    id
  );

  if (updateParams.length > 1) {
    await connection.execute(updateQuery, updateParams);
  }
}

/**
 * Updates a client's information in the database
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string|number} req.params.id - Client ID
 * @param {Object} req.body - Request body containing client data
 * @param {string} [req.body.email] - Client's email
 * @param {string} [req.body.phone] - Client's phone number
 * @param {string} [req.body.address] - Client's address
 * @param {string} [req.body.image] - Client's image URL
 * @param {boolean} [req.body.is_active] - Client's active status
 * @param {string} [req.body.first_name] - Individual client's first name
 * @param {string} [req.body.last_name] - Individual client's last name
 * @param {string} [req.body.company_name] - Company client's name
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function updateClient(req, res) {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const {
      email,
      phone,
      address,
      image,
      is_active,
      first_name,
      last_name,
      company_name,
    } = req.body;

    await connection.beginTransaction();

    const mainClientData = { email, phone, address, image, is_active };
    const clientUpdated = await updateMainClientData(
      connection,
      id,
      mainClientData
    );

    if (!clientUpdated) {
      await connection.rollback();
      return res.status(404).json({ message: 'Client not found' });
    }

    const [clientTypeResult] = await connection.execute(
      'SELECT type FROM Client WHERE id = ?',
      [id]
    );

    const clientType = clientTypeResult[0]?.type;
    if (!clientType) {
      await connection.rollback();
      return res.status(404).json({ message: 'Client type not found' });
    }

    if (
      clientType === 'individual' &&
      (first_name !== undefined || last_name !== undefined)
    ) {
      await updateIndividualClient(connection, id, { first_name, last_name });
    } else if (clientType === 'company' && company_name !== undefined) {
      await connection.execute(
        'UPDATE Client_Company SET company_name = ? WHERE client_id = ?',
        [company_name, id]
      );
    }

    await connection.commit();
    res.json({ message: 'Client updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
}

/**
 * Deletes a client by ID
 * @async
 * @param {Object} req - Request object containing client ID
 * @param {Object} res - Response object
 */
async function deleteClient(req, res) {
  if (!req.params.id) {
    return res.status(400).json({ error: 'Client ID is required' });
  }
  await deleteEntity({
    tableName: TABLE_NAME,
    id: req.params.id,
    res,
  });
}

/**
 * Lists all clients with filtering and pagination
 * @async
 * @param {Object} req - Request object containing filter parameters
 * @param {Object} res - Response object
 */
async function listClients(req, res) {
  try {
    const { type, is_active, search } = req.query;

    let baseQuery = `
      SELECT 
        c.*,
        CASE 
          WHEN c.type = 'individual' THEN CONCAT(ci.first_name, ' ', ci.last_name)
          WHEN c.type = 'company' THEN cc.company_name
          ELSE NULL
        END as client_name
      FROM Client c
      LEFT JOIN Client_Individual ci ON c.id = ci.client_id
      LEFT JOIN Client_Company cc ON c.id = cc.client_id
      WHERE 1=1
    `;
    const params = [];

    if (type) {
      baseQuery += ' AND c.type = ?';
      params.push(type);
    }

    if (is_active !== undefined) {
      baseQuery += ' AND c.is_active = ?';
      params.push(is_active);
    }

    if (search) {
      baseQuery += ` AND (
        c.email LIKE ? OR 
        c.phone LIKE ? OR
        c.address LIKE ? OR
        ci.first_name LIKE ? OR
        ci.last_name LIKE ? OR
        cc.company_name LIKE ?
      )`;
      const searchParam = `%${search}%`;
      params.push(
        searchParam,
        searchParam,
        searchParam,
        searchParam,
        searchParam,
        searchParam
      );
    }

    baseQuery += ' ORDER BY c.created_at DESC';

    const [clients] = await pool.execute(baseQuery, params);

    res.json({
      data: clients,
    });
  } catch (error) {
    console.error('Error listing clients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createClient,
  getClientById,
  updateClient,
  deleteClient,
  listClients,
};
