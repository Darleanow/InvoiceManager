/**
 * @file controllers/invoices.js
 * @module templateController
 * @description Handles template-related operations including CRUD
const pool = require('../../config/database');

/**
 * Creates a new template
 * @async
 * @param {Object} req - Request object containing template data
 * @param {Object} res - Response object
 */
async function createTemplate(req, res) {
  try {
    const { template_name } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO Template (template_name) VALUES (?)`,
      [template_name]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Template created successfully',
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Retrieves a template by ID
 * @async
 * @param {Object} req - Request object containing template ID
 * @param {Object} res - Response object
 */
async function getTemplateById(req, res) {
  try {
    const { id } = req.params;

    const [templates] = await pool.execute(
      `SELECT * FROM Template WHERE id = ?`,
      [id]
    );

    if (templates.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(templates[0]);
  } catch (error) {
    console.error('Error retrieving template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Updates a template's details
 * @async
 * @param {Object} req - Request object containing updated template data
 * @param {Object} res - Response object
 */
async function updateTemplate(req, res) {
  try {
    const { id } = req.params;
    const { template_name } = req.body;

    const [result] = await pool.execute(
      `UPDATE Template SET template_name = ? WHERE id = ?`,
      [template_name, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({ message: 'Template updated successfully' });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Deletes a template by ID
 * @async
 * @param {Object} req - Request object containing template ID
 * @param {Object} res - Response object
 */
async function deleteTemplate(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(`DELETE FROM Template WHERE id = ?`, [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Lists all templates
 * @async
 * @param {Object} req - Request object containing filter parameters
 * @param {Object} res - Response object
 */
async function listTemplates(req, res) {
  try {
    const [templates] = await pool.execute(
      `SELECT * FROM Template ORDER BY created_at DESC`
    );

    res.json({
      data: templates,
    });
  } catch (error) {
    console.error('Error listing templates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createTemplate,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  listTemplates,
};
