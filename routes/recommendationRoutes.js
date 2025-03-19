const express = require('express');
const { nextMealHandler, recommendMenuHandler } = require('../controllers/recommendationController');
const router = express.Router();

router.route('/next_meal/:username').get(nextMealHandler);
router.route('/menu/:username').get(recommendMenuHandler);

module.exports = router;