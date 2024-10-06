/**
 * @file routes/index.js
 * @description Defines the API routes for invoices, benefits, customers, and example operations.
 * Includes rate limiting to control the number of requests from a single IP.
 */

const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const examplesController = require("../controllers/examples/examples");
const invoicesController = require("../controllers/invoices/invoices");
const benefitsController = require("../controllers/benefits/benefits");
const customersController = require("../controllers/customers/customers");

/**
 * Rate limiting middleware to restrict excessive requests from a single IP.
 *
 * @const
 * @default
 * @property {number} windowMs - Time frame for which requests are checked/remembered (in milliseconds).
 * @property {number} max - Max number of requests per `windowMs`.
 * @property {string} message - Message sent when rate limit is exceeded.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

router.use(limiter); // Apply the rate limiting to all routes.

/**
 * @route POST /invoices
 * @description Create a new invoice.
 * @access Public
 */
router.post("/invoices", invoicesController.createInvoice);

/**
 * @route GET /invoices
 * @description Retrieve all invoices.
 * @access Public
 */
router.get("/invoices", invoicesController.getInvoices);

/**
 * @route GET /invoices/:id
 * @description Retrieve a single invoice by ID.
 * @param {string} id - The ID of the invoice.
 * @access Public
 */
router.get("/invoices/:id", invoicesController.getInvoiceById);

/**
 * @route PUT /invoices/:id
 * @description Update an invoice by ID.
 * @param {string} id - The ID of the invoice.
 * @access Public
 */
router.put("/invoices/:id", invoicesController.updateInvoice);

/**
 * @route DELETE /invoices/:id
 * @description Delete an invoice by ID.
 * @param {string} id - The ID of the invoice.
 * @access Public
 */
router.delete("/invoices/:id", invoicesController.deleteInvoice);

/**
 * @route POST /benefits
 * @description Create a new benefit.
 * @access Public
 */
router.post("/benefits", benefitsController.createBenefit);

/**
 * @route GET /invoices/:invoiceId/benefits
 * @description Retrieve benefits by invoice ID.
 * @param {string} invoiceId - The ID of the invoice.
 * @access Public
 */
router.get(
  "/invoices/:invoiceId/benefits",
  benefitsController.getBenefitByInvoiceId
);

/**
 * @route PUT /benefits/:id
 * @description Update a benefit by ID.
 * @param {string} id - The ID of the benefit.
 * @access Public
 */
router.put("/benefits/:id", benefitsController.updateBenefit);

/**
 * @route DELETE /benefits/:id
 * @description Delete a benefit by ID.
 * @param {string} id - The ID of the benefit.
 * @access Public
 */
router.delete("/benefits/:id", benefitsController.deleteBenefit);

/**
 * @route POST /customers
 * @description Create a new customer.
 * @access Public
 */
router.post("/customers", customersController.createCustomer);

/**
 * @route GET /customers
 * @description Retrieve all customers.
 * @access Public
 */
router.get("/customers", customersController.getCustomers);

/**
 * @route GET /customers/:id
 * @description Retrieve a single customer by ID.
 * @param {string} id - The ID of the customer.
 * @access Public
 */
router.get("/customers/:id", customersController.getCustomerById);

/**
 * @route PUT /customers/:id
 * @description Update a customer by ID.
 * @param {string} id - The ID of the customer.
 * @access Public
 */
router.put("/customers/:id", customersController.updateCustomer);

/**
 * @route DELETE /customers/:id
 * @description Delete a customer by ID.
 * @param {string} id - The ID of the customer.
 * @access Public
 */
router.delete("/customers/:id", customersController.deleteCustomer);

/**
 * @route GET /test/add/:num1/:num2
 * @description Add two numbers and return the result.
 * @param {number} num1 - The first number.
 * @param {number} num2 - The second number.
 * @access Public
 */
router.get("/test/add/:num1/:num2", examplesController.add);

/**
 * @route GET /test/multiply/:num1/:num2
 * @description Multiply two numbers and return the result.
 * @param {number} num1 - The first number.
 * @param {number} num2 - The second number.
 * @access Public
 */
router.get("/test/multiply/:num1/:num2", examplesController.multiply);

/**
 * @route GET /test/reverse/:input
 * @description Reverse a string input and return the result.
 * @param {string} input - The input string to be reversed.
 * @access Public
 */
router.get("/test/reverse/:input", examplesController.reverseString);

module.exports = router;
