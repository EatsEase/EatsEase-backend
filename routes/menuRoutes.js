const express = require('express');
const { getAllMenuHandler, getRequestedMenuHandler, createMenuHandler, updateMenuHandler, deleteMenuHandler } = require('../controllers/menuController');
const { verifyJWTAuth } = require('../middleware/jwtAuthHandler');
const router = express.Router();

// router.use(verifyJWTAuth)
router.route('/all').get(getAllMenuHandler);
router.route('/:menu_name').get(getRequestedMenuHandler);
router.route('/create').post(createMenuHandler);
router.route('/edit/:menu_name').put(updateMenuHandler);
router.route('/delete/:menu_name').delete(deleteMenuHandler);

module.exports = router;