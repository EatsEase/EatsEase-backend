const express = require('express');
const { verifyJWTAuth } = require('../middleware/jwtAuthHandler');

const { getAllAllergiesHandler, createMultipleAllergiesHandler } = require('../controllers/allergiesController');

const router = express.Router();

router.use(verifyJWTAuth)
router.route('/all').get(getAllAllergiesHandler);
router.route('/create').post(createMultipleAllergiesHandler);

module.exports = router;
