const express = require('express');
const router = express.Router();
const examplesController = require('../controllers/examples/examples');
const invoicesController = require('../controllers/invoices/invoices');
const benefitsController = require('../controllers/benefits/benefits');

router.post('/invoices', invoicesController.createInvoice);
router.get('/invoices', invoicesController.getInvoices);
router.get('/invoices/:id', invoicesController.getInvoiceById);
router.put('/invoices/:id', invoicesController.updateInvoice);
router.delete('/invoices/:id', invoicesController.deleteInvoice);

router.post('/benefits', benefitsController.createBenefit);
router.get('/benefits', benefitsController.getBenefits);
router.get('/benefits/:id', benefitsController.getBenefitById);
router.put('/benefits/:id', benefitsController.updateBenefit);
router.delete('/benefits/:id', benefitsController.deleteBenefit);

router.get('/test/add/:num1/:num2', examplesController.add);
router.get('/test/multiply/:num1/:num2', examplesController.multiply);
router.get('/test/reverse/:input', examplesController.reverseString);

module.exports = router;
