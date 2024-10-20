/**
 * @file controllers/clients.js
 * @module clientController
 * @description Handles client-related operations including CRUD
 */

const pool = require('../../config/database');

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

    const clientEmail = email || null;
    const clientPhone = phone || null;
    const clientType = type || null;
    const clientAddress = address || null;
    const clientImage = image || null;
    const clientFirstName = first_name || null;
    const clientLastName = last_name || null;
    const clientCompanyName = company_name || null;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [clientResult] = await connection.execute(
        `INSERT INTO Client (email, phone, type, address, image)
           VALUES (?, ?, ?, ?, ?)`,
        [clientEmail, clientPhone, clientType, clientAddress, clientImage]
      );

      const client_id = clientResult.insertId;

      if (clientType === 'individual') {
        await connection.execute(
          `INSERT INTO Client_Individual (client_id, first_name, last_name)
             VALUES (?, ?, ?)`,
          [client_id, clientFirstName, clientLastName]
        );
      } else if (clientType === 'company') {
        await connection.execute(
          `INSERT INTO Client_Company (client_id, company_name)
             VALUES (?, ?)`,
          [client_id, clientCompanyName]
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
      console.error('Error creating client:', error);
      res.status(500).json({ error: 'Internal server error' });
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
 * Updates a client's details
 * @async
 * @param {Object} req - Request object containing updated client data
 * @param {Object} res - Response object
 */
async function updateClient(req, res) {
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

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      let updateQuery = `UPDATE Client SET `;
      const updateParams = [];

      if (email !== undefined) {
        updateQuery += `email = ?, `;
        updateParams.push(email);
      }
      if (phone !== undefined) {
        updateQuery += `phone = ?, `;
        updateParams.push(phone);
      }
      if (address !== undefined) {
        updateQuery += `address = ?, `;
        updateParams.push(address);
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
        const [clientResult] = await connection.execute(
          updateQuery,
          updateParams
        );

        if (clientResult.affectedRows === 0) {
          await connection.rollback();
          return res.status(404).json({ message: 'Client not found' });
        }
      }

      const [clientTypeResult] = await connection.execute(
        `SELECT type FROM Client WHERE id = ?`,
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
        let individualQuery = `UPDATE Client_Individual SET `;
        const individualParams = [];

        if (first_name !== undefined) {
          individualQuery += `first_name = ?, `;
          individualParams.push(first_name);
        }
        if (last_name !== undefined) {
          individualQuery += `last_name = ?, `;
          individualParams.push(last_name);
        }

        individualQuery = individualQuery.slice(0, -2);
        individualQuery += ` WHERE client_id = ?`;
        individualParams.push(id);

        if (individualParams.length > 1) {
          await connection.execute(individualQuery, individualParams);
        }
      } else if (clientType === 'company' && company_name !== undefined) {
        await connection.execute(
          `UPDATE Client_Company SET company_name = ? WHERE client_id = ?`,
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
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Deletes a client by ID
 * @async
 * @param {Object} req - Request object containing client ID
 * @param {Object} res - Response object
 */
async function deleteClient(req, res) {
  try {
    const { id } = req.params;

    if (id === undefined) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    const [result] = await pool.execute(`DELETE FROM Client WHERE id = ?`, [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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

    const clientType = type || null;
    const clientIsActive = is_active !== undefined ? is_active : null;
    const clientSearch = search || null;

    if (clientType) {
      baseQuery += ' AND c.type = ?';
      params.push(clientType);
    }

    if (clientIsActive !== null) {
      baseQuery += ' AND c.is_active = ?';
      params.push(clientIsActive);
    }

    if (clientSearch) {
      baseQuery += ` AND (
        c.email LIKE ? OR 
        c.phone LIKE ? OR
        c.address LIKE ? OR
        ci.first_name LIKE ? OR
        ci.last_name LIKE ? OR
        cc.company_name LIKE ?
      )`;
      const searchParam = `%${clientSearch}%`;
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
