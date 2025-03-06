const express = require('express');

const { getAllAllergiesHandler, createMultipleAllergiesHandler } = require('../controllers/allergiesController');

const router = express.Router();

router.route('/all').get(getAllAllergiesHandler);
router.route('/create').post(createMultipleAllergiesHandler);

module.exports = router;
