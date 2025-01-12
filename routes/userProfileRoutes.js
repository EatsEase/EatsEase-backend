const express = require('express');
const { getUserProfileHandler, updateUserProfileHandler, updateReactionToMenuHandler } = require('../controllers/userProfileController');

const router = express.Router();

router.route('/:username').get(getUserProfileHandler);
router.route('/edit/:username').put(updateUserProfileHandler);
router.route('/reactions/:username').put(updateReactionToMenuHandler);

module.exports = router;