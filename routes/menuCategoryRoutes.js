const express = require('express');
const { getAllMenuCategoriesHandler, getRequestedMenuCategoriesHandler,createMenuCategoryHandler, updateMenuCategoryHandler, deleteMenuCategoryHandler } = require('../controllers/menuCategoryController');
const router = express.Router();

router.route('/all').get(getAllMenuCategoriesHandler);
router.route('/:category_name').get(getRequestedMenuCategoriesHandler);
router.route('/create').post(createMenuCategoryHandler);
router.route('/edit/:category_name').put(updateMenuCategoryHandler);
router.route('/delete/:category_name').delete(deleteMenuCategoryHandler);

module.exports = router;