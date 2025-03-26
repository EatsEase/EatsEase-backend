const express = require('express');
const { loginHandler, signupHandler, guestHandler, logoutHandler } = require('../controllers/userController');

const router = express.Router();

router.route('/login').post(loginHandler);
router.route('/signup').post(signupHandler);
router.route('/guest').get(guestHandler);
router.route('/logout').post(logoutHandler);

module.exports = router;