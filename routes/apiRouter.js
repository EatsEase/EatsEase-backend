const express = require('express');
const router = express.Router();

router.use('/menu', require('./menuRoutes'));
router.use('/category', require('./menuCategoryRoutes'));
router.use('/restaurant', require('./restaurantRoutes'));
router.use('/user', require('./userRoutes'));

module.exports = router;