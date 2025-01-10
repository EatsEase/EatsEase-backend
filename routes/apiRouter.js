const express = require('express');
const router = express.Router();

router.use('/menu', require('./menuRoutes'));

module.exports = router;