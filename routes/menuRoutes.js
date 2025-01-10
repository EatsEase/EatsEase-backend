const express = require('express');
const { getRequestedMenuHandler, createMenuHandler, updateMenuHandler, deleteMenuHandler } = require('../controllers/menuController');
const router = express.Router();

router.route('/:menu_name').get(getRequestedMenuHandler);
router.route('/create').post(createMenuHandler);
router.route('/edit/:menu_name').put(updateMenuHandler);
router.route('/delete/:menu_name').delete(deleteMenuHandler);

module.exports = router;