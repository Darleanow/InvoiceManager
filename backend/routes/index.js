/**
 * @file routes/index.js
 * @module routes
 * @description Defines the API routes for invoices and clients.
 * @see {@link TODO} Swagger Documentation
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const invoicesController = require('../controllers/invoices/invoices');
const clientsController = require('../controllers/clients/clients');
const itemsController = require('../controllers/items/items');
const templatesController = require('../controllers/templates/templates');
const taxesController = require('../controllers/taxes/taxes');
const discountsController = require('../controllers/discounts/discounts');
const attachmentsController = require('../controllers/attachments/attachments');

/**
 * Rate limiting middleware to restrict excessive requests from a single IP.
 * @const {Object} limiter
 * @memberof module:routes
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

router.use(limiter);

/**
 * @swagger
 * tags:
 *   - name: Invoices
 *     description: Operations related to invoices
 *   - name: Clients
 *     description: Operations related to clients
 *   - name: Items
 *     description: Operations related to items
 *   - name: Templates
 *     description: Operations related to templates
 *   - name: Taxes
 *     description: Operations related to taxes
 *   - name: Discounts
 *     description: Operations related to discounts
 *   - name: Attachments
 *     description: Operations related to attachments
 */

/** ------------------------ Invoices Routes ------------------------ **/

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               template_id:
 *                 type: integer
 *               expiration_date:
 *                 type: string
 *                 format: date
 *               currency:
 *                 type: string
 *               private_notes:
 *                 type: string
 *               invoice_name:
 *                 type: string
 *               invoice_subject:
 *                 type: string
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created invoice.
 *                 invoice_number:
 *                   type: string
 *                   description: The generated invoice number.
 */
router.post('/invoices', invoicesController.createInvoice);

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Retrieve all invoices with filtering
 *     tags: [Invoices]
 *     parameters:
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter invoices by state.
 *       - in: query
 *         name: client_id
 *         schema:
 *           type: integer
 *         description: Filter invoices by client ID.
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter invoices from this date.
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter invoices up to this date.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering invoices.
 *     responses:
 *       200:
 *         description: A list of invoices.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */
router.get('/invoices', invoicesController.listInvoices);

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Retrieve a single invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the invoice
 *     responses:
 *       200:
 *         description: Invoice details
 *       404:
 *         description: Invoice not found
 */
router.get('/invoices/:id', invoicesController.getInvoiceById);

/**
 * @swagger
 * /invoices/{id}:
 *   put:
 *     summary: Update an invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the invoice to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expiration_date:
 *                 type: string
 *                 format: date
 *               currency:
 *                 type: string
 *               private_notes:
 *                 type: string
 *               invoice_name:
 *                 type: string
 *               invoice_subject:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated invoice
 *       404:
 *         description: Invoice not found
 */
router.put('/invoices/:id', invoicesController.updateInvoice);

/**
 * @swagger
 * /invoices/state/{id}:
 *   patch:
 *     summary: Update the state of an invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the invoice to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 description: The new state of the invoice.
 *     responses:
 *       200:
 *         description: Invoice state updated successfully
 *       404:
 *         description: Invoice not found
 */
router.patch('/invoices/state/:id', invoicesController.updateInvoiceState);

/** ------------------------ Clients Routes ------------------------ **/

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [individual, company]
 *               address:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               company_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created client.
 *       500:
 *         description: Internal server error
 */
router.post('/clients', clientsController.createClient);

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Retrieve all clients with filtering
 *     tags: [Clients]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [individual, company]
 *         description: Filter clients by type.
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter clients by active status.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering clients.
 *     responses:
 *       200:
 *         description: A list of clients.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */
router.get('/clients', clientsController.listClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Retrieve a single client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the client
 *     responses:
 *       200:
 *         description: Client details
 *       404:
 *         description: Client not found
 */
router.get('/clients/:id', clientsController.getClientById);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Update a client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the client to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               is_active:
 *                 type: boolean
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               company_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client updated successfully
 *       404:
 *         description: Client not found
 */
router.put('/clients/:id', clientsController.updateClient);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Delete a client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the client to delete
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *       404:
 *         description: Client not found
 */
router.delete('/clients/:id', clientsController.deleteClient);

/** ------------------------ Items Routes ------------------------ **/

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               default_price:
 *                 type: number
 *                 format: float
 *               type:
 *                 type: string
 *                 enum: [product, service]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created item.
 *       500:
 *         description: Internal server error
 */
router.post('/items', itemsController.createItem);

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retrieve all items with filtering
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [product, service]
 *         description: Filter items by type.
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter items by active status.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering items by name or description.
 *     responses:
 *       200:
 *         description: A list of items.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */
router.get('/items', itemsController.listItems);

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Retrieve a single item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the item
 *     responses:
 *       200:
 *         description: Item details
 *       404:
 *         description: Item not found
 */
router.get('/items/:id', itemsController.getItemById);

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               default_price:
 *                 type: number
 *                 format: float
 *               type:
 *                 type: string
 *                 enum: [product, service]
 *               image:
 *                 type: string
 *                 format: binary
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Item not found
 */
router.put('/items/:id', itemsController.updateItem);

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the item to delete
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 */
router.delete('/items/:id', itemsController.deleteItem);

/** ------------------------ Templates Routes ------------------------ **/

/**
 * @swagger
 * /templates:
 *   post:
 *     summary: Create a new template
 *     tags: [Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               template_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Template created successfully
 */
router.post('/templates', templatesController.createTemplate);

/**
 * @swagger
 * /templates:
 *   get:
 *     summary: Retrieve all templates
 *     tags: [Templates]
 *     responses:
 *       200:
 *         description: A list of templates.
 */
router.get('/templates', templatesController.listTemplates);

/**
 * @swagger
 * /templates/{id}:
 *   get:
 *     summary: Retrieve a template by ID
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the template
 *     responses:
 *       200:
 *         description: Template details
 *       404:
 *         description: Template not found
 */
router.get('/templates/:id', templatesController.getTemplateById);

/**
 * @swagger
 * /templates/{id}:
 *   put:
 *     summary: Update a template by ID
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the template to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               template_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Template updated successfully
 *       404:
 *         description: Template not found
 */
router.put('/templates/:id', templatesController.updateTemplate);

/**
 * @swagger
 * /templates/{id}:
 *   delete:
 *     summary: Delete a template by ID
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the template to delete
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *       404:
 *         description: Template not found
 */
router.delete('/templates/:id', templatesController.deleteTemplate);

/** ------------------------ Taxes Routes ------------------------ **/

/**
 * @swagger
 * /taxes:
 *   post:
 *     summary: Create a new tax
 *     tags: [Taxes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               rate:
 *                 type: number
 *                 format: float
 *               apply_by_default:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tax created successfully
 */
router.post('/taxes', taxesController.createTax);

/**
 * @swagger
 * /taxes:
 *   get:
 *     summary: Retrieve all taxes
 *     tags: [Taxes]
 *     responses:
 *       200:
 *         description: A list of taxes.
 */
router.get('/taxes', taxesController.listTaxes);

/**
 * @swagger
 * /taxes/{id}:
 *   get:
 *     summary: Retrieve a tax by ID
 *     tags: [Taxes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the tax
 *     responses:
 *       200:
 *         description: Tax details
 *       404:
 *         description: Tax not found
 */
router.get('/taxes/:id', taxesController.getTaxById);

/**
 * @swagger
 * /taxes/{id}:
 *   put:
 *     summary: Update a tax by ID
 *     tags: [Taxes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the tax to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               rate:
 *                 type: number
 *                 format: float
 *               apply_by_default:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tax updated successfully
 *       404:
 *         description: Tax not found
 */
router.put('/taxes/:id', taxesController.updateTax);

/**
 * @swagger
 * /taxes/{id}:
 *   delete:
 *     summary: Delete a tax by ID
 *     tags: [Taxes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the tax to delete
 *     responses:
 *       200:
 *         description: Tax deleted successfully
 *       404:
 *         description: Tax not found
 */
router.delete('/taxes/:id', taxesController.deleteTax);

/** ------------------------ Discounts Routes ------------------------ **/

/**
 * @swagger
 * /discounts:
 *   post:
 *     summary: Create a new discount
 *     tags: [Discounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               value:
 *                 type: number
 *                 format: float
 *               is_active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Discount created successfully
 */
router.post('/discounts', discountsController.createDiscount);

/**
 * @swagger
 * /discounts:
 *   get:
 *     summary: Retrieve all discounts
 *     tags: [Discounts]
 *     responses:
 *       200:
 *         description: A list of discounts.
 */
router.get('/discounts', discountsController.listDiscounts);

/**
 * @swagger
 * /discounts/{id}:
 *   get:
 *     summary: Retrieve a discount by ID
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the discount
 *     responses:
 *       200:
 *         description: Discount details
 *       404:
 *         description: Discount not found
 */
router.get('/discounts/:id', discountsController.getDiscountById);

/**
 * @swagger
 * /discounts/{id}:
 *   put:
 *     summary: Update a discount by ID
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the discount to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               value:
 *                 type: number
 *                 format: float
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Discount updated successfully
 *       404:
 *         description: Discount not found
 */
router.put('/discounts/:id', discountsController.updateDiscount);

/**
 * @swagger
 * /discounts/{id}:
 *   delete:
 *     summary: Delete a discount by ID
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the discount to delete
 *     responses:
 *       200:
 *         description: Discount deleted successfully
 *       404:
 *         description: Discount not found
 */
router.delete('/discounts/:id', discountsController.deleteDiscount);

/** ------------------------ Attachments Routes ------------------------ **/

/**
 * @swagger
 * /attachments:
 *   post:
 *     summary: Create a new attachment
 *     tags: [Attachments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invoice_id:
 *                 type: integer
 *               file_name:
 *                 type: string
 *               file_data:
 *                 type: string
 *                 format: binary
 *               extension:
 *                 type: string
 *                 enum: [pdf, jpg, png, docx, txt]
 *     responses:
 *       201:
 *         description: Attachment created successfully
 */
router.post('/attachments', attachmentsController.createAttachment);

/**
 * @swagger
 * /attachments/{id}:
 *   get:
 *     summary: Retrieve an attachment by ID
 *     tags: [Attachments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the attachment
 *     responses:
 *       200:
 *         description: Attachment details
 *       404:
 *         description: Attachment not found
 */
router.get('/attachments/:id', attachmentsController.getAttachmentById);

/**
 * @swagger
 * /attachments/invoice/{invoice_id}:
 *   get:
 *     summary: Retrieve all attachments for a specific invoice
 *     tags: [Attachments]
 *     parameters:
 *       - in: path
 *         name: invoice_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the invoice
 *     responses:
 *       200:
 *         description: A list of attachments.
 */
router.get(
  '/attachments/invoice/:invoice_id',
  attachmentsController.listAttachmentsByInvoice
);

/**
 * @swagger
 * /attachments/{id}:
 *   delete:
 *     summary: Delete an attachment by ID
 *     tags: [Attachments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the attachment to delete
 *     responses:
 *       200:
 *         description: Attachment deleted successfully
 *       404:
 *         description: Attachment not found
 */
router.delete('/attachments/:id', attachmentsController.deleteAttachment);

module.exports = router;
