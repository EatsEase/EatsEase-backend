const express = require('express');
const { getAllRestaurantHandler, getRequestedRestaurantHandler, createRestaurantHandler, updateRestaurantHandler, deleteRestaurantHandler, getQueryRestaurantHandler } = require('../controllers/restaurantController');
const router = express.Router();

router.route('/all').get(getAllRestaurantHandler);
router.route('/:restaurant_name').get(getRequestedRestaurantHandler);
router.route('/create').post(createRestaurantHandler);
router.route('/edit/:restaurant_name').put(updateRestaurantHandler);
router.route('/delete/:restaurant_name').delete(deleteRestaurantHandler);
router.route('/query').post(getQueryRestaurantHandler);

module.exports = router;