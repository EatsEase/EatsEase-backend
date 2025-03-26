const express = require('express');
const { nextMealHandler, recommendMenuHandler } = require('../controllers/recommendationController');
const router = express.Router();
const { verifyJWTAuth } = require('../middleware/jwtAuthHandler');

router.use(verifyJWTAuth)
router.route('/next_meal/:username').get(nextMealHandler);
router.route('/menu/:username').get(recommendMenuHandler);

module.exports = router;