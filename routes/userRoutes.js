const express = require('express');
const { loginHandler, signupHandler } = require('../controllers/userController');

const router = express.Router();

router.route('/login').post(loginHandler);
router.route('/signup').post(signupHandler);

module.exports = router;