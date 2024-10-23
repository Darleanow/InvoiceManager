/**
 * @file controllers/invoices.js
 * @module invoiceController
 * @description Handles invoice-related operations including CRUD and state management
 */

const { getEntityById, updateEntity } = require('../utils/utils');
const pool = require('../../config/database');

const TABLE_NAME = 'Invoice';

/**
 * Creates a new invoice
 * @async
 * @param {Object} req - Request object containing invoice data
 * @param {Object} res - Response object
 */
async function createInvoice(req, res) {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'User authentication required' });
  }

  try {
    const {
      client_id,
      template_id,
      expiration_date,
      currency,
      notes,
      invoice_subject,
    } = req.body;

    const [clientCheck] = await pool.execute(
      'SELECT id FROM Client WHERE id = ? AND created_by_user_id = ?',
      [client_id, req.user.id]
    );

    if (clientCheck.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const [lastInvoice] = await pool.execute(
      'SELECT MAX(CAST(SUBSTRING(invoice_number, 4) AS UNSIGNED)) as last_num FROM Invoice WHERE invoice_number LIKE ?',
      [`INV${new Date().getFullYear()}%`]
    );

    const nextNum = (lastInvoice[0].last_num || 0) + 1;
    const invoice_number = `INV${new Date().getFullYear()}${nextNum.toString().padStart(4, '0')}`;

    const [result] = await pool.execute(
      `INSERT INTO Invoice (
        invoice_number, client_id, created_by_user_id, template_id, 
        expiration_date, currency, notes, invoice_subject
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invoice_number,
        client_id,
        req.user.id,
        template_id,
        expiration_date,
        currency,
        notes,
        invoice_subject,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      invoice_number,
      message: 'Invoice created successfully',
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Retrieves an invoice by ID with all related information
 * @async
 * @param {Object} req - Request object containing invoice ID
 * @param {Object} res - Response object
 */
async function getInvoiceById(req, res) {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'User authentication required' });
  }

  try {
    const { id } = req.params;

    const [invoice] = await pool.execute(
      `SELECT 
        i.*,
        JSON_OBJECT(
          'id', c.id,
          'email', c.email,
          'phone', c.phone,
          'type', c.type,
          'address', c.address,
          'details', CASE 
            WHEN c.type = 'individual' THEN 
              (SELECT JSON_OBJECT('first_name', ci.first_name, 'last_name', ci.last_name)
               FROM Client_Individual ci WHERE ci.client_id = c.id)
            ELSE 
              (SELECT JSON_OBJECT('company_name', cc.company_name)
               FROM Client_Company cc WHERE cc.client_id = c.id)
          END
        ) as client,
        (SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', il.id,
            'item_id', il.item_id,
            'quantity', il.quantity,
            'price', il.price,
            'description', il.description,
            'item_details', (SELECT JSON_OBJECT(
              'name', i.name,
              'description', i.description,
              'type', i.type
            ) FROM Item i WHERE i.id = il.item_id)
          )
        ) FROM Invoice_Line il WHERE il.invoice_id = i.id) as line_items,
        (SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', t.id,
            'name', t.name,
            'rate', t.rate
          )
        ) FROM Tax t 
        JOIN Invoice_Tax it ON t.id = it.tax_id 
        WHERE it.invoice_id = i.id) as taxes,
        (SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', d.id,
            'name', d.name,
            'type', d.type,
            'value', d.value
          )
        ) FROM Discount d 
        JOIN Invoice_Discount id ON d.id = id.discount_id 
        WHERE id.invoice_id = i.id) as discounts
      FROM Invoice i
      JOIN Client c ON i.client_id = c.id
      WHERE i.id = ? AND i.created_by_user_id = ?`,
      [id, req.user.id]
    );

    if (!invoice[0]) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice[0]);
  } catch (error) {
    console.error('Error retrieving invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Updates an invoice's details
 * @async
 * @param {Object} req - Request object containing updated invoice data
 * @param {Object} res - Response object
 */
async function updateInvoice(req, res) {
  await updateEntity({
    tableName: TABLE_NAME,
    id: req.params.id,
    data: req.body,
    res,
    user: req.user,
    userIdField: 'created_by_user_id',
  });
}

/**
 * Updates an invoice's state
 * @async
 * @param {Object} req - Request object containing new state
 * @param {Object} res - Response object
 */
async function updateInvoiceState(req, res) {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'User authentication required' });
  }

  try {
    const { id } = req.params;
    const { state } = req.body;

    const [result] = await pool.execute(
      'UPDATE Invoice SET state = ? WHERE id = ? AND created_by_user_id = ?',
      [state, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    await pool.execute('SET @current_user_id = ?', [req.user.id]);
    res.json({ message: 'Invoice state updated successfully' });
  } catch (error) {
    console.error('Error updating invoice state:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Lists all invoices with filtering and pagination
 * @async
 * @param {Object} req - Request object containing filter parameters
 * @param {Object} res - Response object
 */
async function listInvoices(req, res) {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'User authentication required' });
  }

  try {
    const { state, client_id, from_date, to_date, search } = req.query;

    let baseQuery = `
      SELECT 
        i.*,
        COALESCE(CONCAT(ci.first_name, ' ', ci.last_name), cc.company_name, '') AS client_name
      FROM Invoice i
      LEFT JOIN Client c ON i.client_id = c.id
      LEFT JOIN Client_Individual ci ON c.id = ci.client_id
      LEFT JOIN Client_Company cc ON c.id = cc.client_id
      WHERE i.created_by_user_id = ?
    `;
    const params = [req.user.id];

    if (state) {
      baseQuery += ' AND i.state = ?';
      params.push(state);
    }

    if (client_id) {
      baseQuery += ' AND i.client_id = ?';
      params.push(client_id);
    }

    if (from_date) {
      baseQuery += ' AND i.creation_date >= ?';
      params.push(from_date);
    }

    if (to_date) {
      baseQuery += ' AND i.creation_date <= ?';
      params.push(to_date);
    }

    if (search) {
      baseQuery += ` AND (
        i.invoice_number LIKE ? OR 
        CONCAT(COALESCE(ci.first_name, ''), ' ', COALESCE(ci.last_name, '')) LIKE ? OR
        cc.company_name LIKE ?
      )`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    baseQuery += ' ORDER BY i.creation_date DESC';

    const [invoices] = await pool.execute(baseQuery, params);

    res.json({
      data: invoices,
    });
  } catch (error) {
    console.error('Error listing invoices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createInvoice,
  getInvoiceById,
  updateInvoice,
  updateInvoiceState,
  listInvoices,
};
