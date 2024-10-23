/**
 * @file controllers/attachments/attachments.js
 * @module attachmentsController
 * @description Handles attachment-related operations including CRUD
 */

const { createEntity, getEntityById, deleteEntity } = require('../utils/utils');
const pool = require('../../config/database');

const TABLE_NAME = 'Attachment';

/**
 * Creates a new attachment
 * @async
 * @param {Object} req - Request object containing attachment data
 * @param {Object} res - Response object
 */
async function createAttachment(req, res) {
  const { invoice_id, file_name, file_data, extension } = req.body;
  await createEntity({
    tableName: TABLE_NAME,
    data: { invoice_id, file_name, file_data, extension },
    res,
  });
}

/**
 * Retrieves an attachment by ID
 * @async
 * @param {Object} req - Request object containing attachment ID
 * @param {Object} res - Response object
 */
async function getAttachmentById(req, res) {
  await getEntityById({
    tableName: TABLE_NAME,
    id: req.params.id,
    res,
  });
}

/**
 * Deletes an attachment by ID
 * @async
 * @param {Object} req - Request object containing attachment ID
 * @param {Object} res - Response object
 */
async function deleteAttachment(req, res) {
  await deleteEntity({
    tableName: TABLE_NAME,
    id: req.params.id,
    res,
  });
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
