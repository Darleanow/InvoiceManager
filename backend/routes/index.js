/**
 * @file routes/index.js
 * @module routes
 * @description Defines the API routes for invoices, benefits, customers, and example operations.
 * @see {@link TODO} Swagger Documentation
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const examplesController = require('../controllers/examples/examples');
const invoicesController = require('../controllers/invoices/invoices');
const benefitsController = require('../controllers/benefits/benefits');
const customersController = require('../controllers/customers/customers');

/**
 * Rate limiting middleware to restrict excessive requests from a single IP.
 * @const {Object} limiter
 * @memberof module:routes
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

router.use(limiter); // Apply rate limiting to all routes

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Operations related to invoices
 */

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
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               customer_id:
 *                 type: integer
 *               benefit_ids:
 *                 type: array
 *                 items:
 *                   type: integer
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
 */
router.post('/invoices', invoicesController.createInvoice);

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Retrieve all invoices
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: A list of invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 */
router.get('/invoices', invoicesController.getInvoices);

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
 *           type: string
 *         required: true
 *         description: The ID of the invoice
 *     responses:
 *       200:
 *         description: Invoice details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
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
 *           type: string
 *         required: true
 *         description: The ID of the invoice to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Updated invoice
 *       404:
 *         description: Invoice not found
 */
router.put('/invoices/:id', invoicesController.updateInvoice);

/**
 * @swagger
 * /invoices/{id}:
 *   delete:
 *     summary: Delete an invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the invoice to delete
 *     responses:
 *       200:
 *         description: Invoice deleted
 *       404:
 *         description: Invoice not found
 */
router.delete('/invoices/:id', invoicesController.deleteInvoice);

/**
 * @swagger
 * tags:
 *   name: Benefits
 *   description: Operations related to benefits
 */

/**
 * @swagger
 * /benefits:
 *   post:
 *     summary: Create a new benefit
 *     tags: [Benefits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               object:
 *                 type: string
 *               unit:
 *                 type: number
 *               price_per_unit:
 *                 type: number
 *     responses:
 *       201:
 *         description: Benefit created successfully
 */
router.post('/benefits', benefitsController.createBenefit);

/**
 * @swagger
 * /invoices/{invoiceId}/benefits:
 *   get:
 *     summary: Retrieve benefits by invoice ID
 *     tags: [Benefits]
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the invoice
 *     responses:
 *       200:
 *         description: List of benefits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   object:
 *                     type: string
 *                   unit:
 *                     type: number
 *                   price_per_unit:
 *                     type: number
 */
router.get(
  '/invoices/:invoiceId/benefits',
  benefitsController.getBenefitByInvoiceId
);

/**
 * @swagger
 * /benefits/{id}:
 *   put:
 *     summary: Update a benefit by ID
 *     tags: [Benefits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the benefit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               object:
 *                 type: string
 *               unit:
 *                 type: number
 *               price_per_unit:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated benefit
 *       404:
 *         description: Benefit not found
 */
router.put('/benefits/:id', benefitsController.updateBenefit);

/**
 * @swagger
 * /benefits/{id}:
 *   delete:
 *     summary: Delete a benefit by ID
 *     tags: [Benefits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the benefit to delete
 *     responses:
 *       200:
 *         description: Benefit deleted
 *       404:
 *         description: Benefit not found
 */
router.delete('/benefits/:id', benefitsController.deleteBenefit);

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Operations related to customers
 */

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_name:
 *                 type: string
 *               customer_email:
 *                 type: string
 *               postal_address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created successfully
 */
router.post('/customers', customersController.createCustomer);

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Retrieve all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   customer_name:
 *                     type: string
 *                   customer_email:
 *                     type: string
 *                   postal_address:
 *                     type: string
 */
router.get('/customers', customersController.getCustomers);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Retrieve a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the customer
 *     responses:
 *       200:
 *         description: Customer details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 customer_name:
 *                   type: string
 *                 customer_email:
 *                   type: string
 *                 postal_address:
 *                   type: string
 *       404:
 *         description: Customer not found
 */
router.get('/customers/:id', customersController.getCustomerById);

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_name:
 *                 type: string
 *               customer_email:
 *                 type: string
 *               postal_address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated
 *       404:
 *         description: Customer not found
 */
router.put('/customers/:id', customersController.updateCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the customer
 *     responses:
 *       200:
 *         description: Customer deleted
 *       404:
 *         description: Customer not found
 */
router.delete('/customers/:id', customersController.deleteCustomer);

/**
 * @swagger
 * tags:
 *   name: Test
 *   description: Example test routes
 */

/**
 * @swagger
 * /test/add/{num1}/{num2}:
 *   get:
 *     summary: Add two numbers and return the result
 *     tags: [Test]
 *     parameters:
 *       - in: path
 *         name: num1
 *         schema:
 *           type: integer
 *         required: true
 *         description: The first number
 *       - in: path
 *         name: num2
 *         schema:
 *           type: integer
 *         required: true
 *         description: The second number
 *     responses:
 *       200:
 *         description: The sum of the two numbers
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 */
router.get('/test/add/:num1/:num2', examplesController.add);

/**
 * @swagger
 * /test/multiply/{num1}/{num2}:
 *   get:
 *     summary: Multiply two numbers and return the result
 *     tags: [Test]
 *     parameters:
 *       - in: path
 *         name: num1
 *         schema:
 *           type: integer
 *         required: true
 *         description: The first number
 *       - in: path
 *         name: num2
 *         schema:
 *           type: integer
 *         required: true
 *         description: The second number
 *     responses:
 *       200:
 *         description: The product of the two numbers
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 */
router.get('/test/multiply/:num1/:num2', examplesController.multiply);

/**
 * @swagger
 * /test/reverse/{input}:
 *   get:
 *     summary: Reverse a string input and return the result
 *     tags: [Test]
 *     parameters:
 *       - in: path
 *         name: input
 *         schema:
 *           type: string
 *         required: true
 *         description: The input string to be reversed
 *     responses:
 *       200:
 *         description: The reversed string
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
router.get('/test/reverse/:input', examplesController.reverseString);

module.exports = router;
