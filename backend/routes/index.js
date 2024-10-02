const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const examplesController = require('../controllers/examples/examples');
const invoicesController = require('../controllers/invoices/invoices');
const benefitsController = require('../controllers/benefits/benefits');
const customersController = require('../controllers/customers/customers');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2000, 
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

router.use(limiter);

router.post('/invoices', invoicesController.createInvoice);
router.get('/invoices', invoicesController.getInvoices);
router.get('/invoices/:id', invoicesController.getInvoiceById);
router.put('/invoices/:id', invoicesController.updateInvoice);
router.delete('/invoices/:id', invoicesController.deleteInvoice);

router.post('/benefits', benefitsController.createBenefit);
router.get('/invoices/:invoiceId/benefits', benefitsController.getBenefitByInvoiceId);
router.put('/benefits/:id', benefitsController.updateBenefit);
router.delete('/benefits/:id', benefitsController.deleteBenefit);

router.post('/customers', customersController.createCustomer);
router.get('/customers', customersController.getCustomers);
router.get('/customers/:id', customersController.getCustomerById);
router.put('/customers/:id', customersController.updateCustomer);
router.delete('/customers/:id', customersController.deleteCustomer);

router.get('/test/add/:num1/:num2', examplesController.add);
router.get('/test/multiply/:num1/:num2', examplesController.multiply);
router.get('/test/reverse/:input', examplesController.reverseString);

module.exports = router;
