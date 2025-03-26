const express = require('express');
const { getHistoryHandler, updateHistoryHandler, createHistoryHandler, deleteHistoryHandler } = require('../controllers/historyController');

const router = express.Router();

router.use(verifyJWTAuth)
router.route('/:username').get(getHistoryHandler);
router.route('/update/:username').put(updateHistoryHandler);

// more like clear history
router.route('/delete/:username').get(deleteHistoryHandler);

module.exports = router;
