const express = require('express');
const { getUserProfileHandler, updateUserProfileHandler } = require('../controllers/userProfileController');

const router = express.Router();

router.route('/:username').get(getUserProfileHandler);
router.route('/edit/:username').put(updateUserProfileHandler);
router.route('/like/:username').put(updateUserProfileHandler);