const express = require('express');
const router = express.Router();

router.use('/menu', require('./menuRoutes'));
router.use('/category', require('./menuCategoryRoutes'));
router.use('/restaurant', require('./restaurantRoutes'));
router.use('/user', require('./userRoutes'));
router.use('/userProfile', require('./userProfileRoutes'));
router.use('/history', require('./historyRoutes'));

module.exports = router;