/**
 * @file controllers/users.js
 * @module userController
 * @description Handles user-related operations including CRUD, integrating with Clerk.
 */

const pool = require('../../config/database');

/**
 * Synchronizes a user from Clerk into the local database
 * @async
 * @param {Object} req - Request object containing user data from Clerk
 * @param {Object} res - Response object
 */
async function syncUser(req, res) {
  try {
    const { clerk_user_id, email, first_name, last_name, username } = req.body;

    if (!clerk_user_id) {
      return res.status(400).json({ error: 'Clerk user ID is required' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [existingUser] = await connection.execute(
        'SELECT id FROM User WHERE clerk_user_id = ?',
        [clerk_user_id]
      );

      let result;
      if (existingUser.length === 0) {
        [result] = await connection.execute(
          `INSERT INTO User (
            clerk_user_id, 
            email, 
            first_name, 
            last_name, 
            username, 
            last_login
          ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          [clerk_user_id, email, first_name, last_name, username]
        );

        await connection.commit();
        res.status(201).json({
          message: 'User created successfully',
          userId: result.insertId,
          isNewUser: true,
        });
      } else {
        [result] = await connection.execute(
          `UPDATE User 
           SET last_login = CURRENT_TIMESTAMP 
           WHERE clerk_user_id = ?`,
          [clerk_user_id]
        );

        await connection.commit();
        res.status(200).json({
          message: 'User login time updated',
          userId: existingUser[0].id,
          isNewUser: false,
        });
      }
    } catch (error) {
      await connection.rollback();

      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('unique_user_email')) {
          return res.status(409).json({
            error: 'Email already in use',
            code: 'EMAIL_DUPLICATE',
          });
        }
        if (error.message.includes('unique_username')) {
          return res.status(409).json({
            error: 'Username already in use',
            code: 'USERNAME_DUPLICATE',
          });
        }
      }

      console.error('Error synchronizing user:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error synchronizing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Retrieves a user by ID
 * @async
 * @param {Object} req - Request object containing user ID
 * @param {Object} res - Response object
 */
async function getUserById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const [users] = await pool.execute(`SELECT * FROM User WHERE id = ?`, [id]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Updates a user's details
 * @async
 * @param {Object} req - Request object containing updated user data
 * @param {Object} res - Response object
 */
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, username, role, is_active } =
      req.body;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      let updateQuery = `UPDATE User SET `;
      const updateParams = [];

      if (email !== undefined) {
        updateQuery += `email = ?, `;
        updateParams.push(email);
      }
      if (first_name !== undefined) {
        updateQuery += `first_name = ?, `;
        updateParams.push(first_name);
      }
      if (last_name !== undefined) {
        updateQuery += `last_name = ?, `;
        updateParams.push(last_name);
      }
      if (username !== undefined) {
        updateQuery += `username = ?, `;
        updateParams.push(username);
      }
      if (role !== undefined) {
        updateQuery += `role = ?, `;
        updateParams.push(role);
      }
      if (is_active !== undefined) {
        updateQuery += `is_active = ?, `;
        updateParams.push(is_active);
      }

      updateQuery = updateQuery.slice(0, -2);
      updateQuery += ` WHERE id = ?`;
      updateParams.push(id);

      const [userResult] = await connection.execute(updateQuery, updateParams);

      if (userResult.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'User not found' });
      }

      await connection.commit();
      res.json({ message: 'User updated successfully' });
    } catch (error) {
      await connection.rollback();
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Deletes a user by ID
 * @async
 * @param {Object} req - Request object containing user ID
 * @param {Object} res - Response object
 */
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const [result] = await pool.execute(`DELETE FROM User WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Lists all users with optional filtering by role or activity status
 * @async
 * @param {Object} req - Request object containing filter parameters
 * @param {Object} res - Response object
 */
async function listUsers(req, res) {
  try {
    const { role, is_active } = req.query;

    let baseQuery = `SELECT * FROM User WHERE 1=1`;
    const params = [];

    if (role) {
      baseQuery += ` AND role = ?`;
      params.push(role);
    }

    if (is_active !== undefined) {
      baseQuery += ` AND is_active = ?`;
      params.push(is_active);
    }

    baseQuery += ` ORDER BY created_at DESC`;

    const [users] = await pool.execute(baseQuery, params);

    res.json({
      data: users,
    });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  syncUser,
  getUserById,
  updateUser,
  deleteUser,
  listUsers,
};
