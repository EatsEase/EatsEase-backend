const express = require('express');
const { getUserProfileHandler, updateUserProfileHandler, getCurrentLikedMenuHandler, deleteCurrentLikedMenuHandler, updateLikedMenuHandler, updateDislikedMenuHandler, updateFinalizedMenuHandler } = require('../controllers/userProfileController');

const router = express.Router();

router.route('/:username').get(getUserProfileHandler);
router.route('/edit/:username').put(updateUserProfileHandler);
router.route('/currentLiked/:username').get(getCurrentLikedMenuHandler);
router.route('/liked/:username').post(updateLikedMenuHandler);
router.route('/disliked/:username').post(updateDislikedMenuHandler);
router.route('/finalized/:username').post(updateFinalizedMenuHandler);
router.route('/currentLiked/:username').delete(deleteCurrentLikedMenuHandler)


module.exports = router;