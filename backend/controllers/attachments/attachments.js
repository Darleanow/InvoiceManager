/**
 * @file controllers/attachments/attachments.js
 * @module attachmentsController
 * @description Handles attachment-related operations including CRUD
 */

const pool = require('../../config/database');

/**
 * Creates a new attachment
 * @async
 * @param {Object} req - Request object containing attachment data
 * @param {Object} res - Response object
 */
async function createAttachment(req, res) {
  try {
    const { invoice_id, file_name, file_data, extension } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO Attachment (invoice_id, file_name, file_data, extension) VALUES (?, ?, ?, ?)`,
      [invoice_id, file_name, file_data, extension]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Attachment created successfully',
    });
  } catch (error) {
    console.error('Error creating attachment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Retrieves an attachment by ID
 * @async
 * @param {Object} req - Request object containing attachment ID
 * @param {Object} res - Response object
 */
async function getAttachmentById(req, res) {
  try {
    const { id } = req.params;

    const [attachments] = await pool.execute(
      `SELECT * FROM Attachment WHERE id = ?`,
      [id]
    );

    if (attachments.length === 0) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    res.json(attachments[0]);
  } catch (error) {
    console.error('Error retrieving attachment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Deletes an attachment by ID
 * @async
 * @param {Object} req - Request object containing attachment ID
 * @param {Object} res - Response object
 */
async function deleteAttachment(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(`DELETE FROM Attachment WHERE id = ?`, [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Error deleting attachment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Lists all attachments for a specific invoice
 * @async
 * @param {Object} req - Request object containing invoice ID
 * @param {Object} res - Response object
 */
async function listAttachmentsByInvoice(req, res) {
  try {
    const { invoice_id } = req.params;

    const [attachments] = await pool.execute(
      `SELECT * FROM Attachment WHERE invoice_id = ? ORDER BY created_at DESC`,
      [invoice_id]
    );

    res.json({
      data: attachments,
    });
  } catch (error) {
    console.error('Error listing attachments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createAttachment,
  getAttachmentById,
  deleteAttachment,
  listAttachmentsByInvoice,
};
