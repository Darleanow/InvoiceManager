const express = require('express');
const router = express.Router();
const examplesController = require('../controllers/examples/examples');


router.get('/test/add/:num1/:num2', examplesController.add);
router.get('/test/multiply/:num1/:num2', examplesController.multiply);
router.get('/test/reverse/:input', examplesController.reverseString);

module.exports = router;
