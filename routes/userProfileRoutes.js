const express = require('express');
const { getUserProfileHandler, updateUserProfileHandler, getCurrentLikedMenuHandler, deleteCurrentLikedMenuHandler, updateLikedMenuHandler, updateDislikedMenuHandler, updateFinalizedMenuHandler, updateFinalizeRestaurantHandler, checkTokenHandler } = require('../controllers/userProfileController');
const { verifyJWTAuth } = require('../middleware/jwtAuthHandler');

const router = express.Router();

router.use(verifyJWTAuth)
router.route('/checkToken').get(checkTokenHandler);
router.route('/:username').get(getUserProfileHandler);
router.route('/edit/:username').put(updateUserProfileHandler);
router.route('/currentLiked/:username').get(getCurrentLikedMenuHandler);
router.route('/liked/:username').post(updateLikedMenuHandler);
router.route('/disliked/:username').post(updateDislikedMenuHandler);
router.route('/currentLiked/:username').delete(deleteCurrentLikedMenuHandler)
router.route('/finalized/menu/:username').post(updateFinalizedMenuHandler);
router.route('/finalized/restaurant/:username').post(updateFinalizeRestaurantHandler);


module.exports = router;