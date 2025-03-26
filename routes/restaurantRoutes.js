const express = require('express');
const { getAllRestaurantHandler, getRequestedRestaurantHandler, createRestaurantHandler, updateRestaurantHandler, deleteRestaurantHandler, getQueryRestaurantHandler, createMultipleRestaurantHandler } = require('../controllers/restaurantController');
const router = express.Router();
const { verifyJWTAuth } = require('../middleware/jwtAuthHandler');

router.use(verifyJWTAuth)
router.route('/all').get(getAllRestaurantHandler);
router.route('/:restaurant_name').get(getRequestedRestaurantHandler);
router.route('/create').post(createRestaurantHandler);
router.route('/createMultiple').post(createMultipleRestaurantHandler)
router.route('/edit/:restaurant_name').put(updateRestaurantHandler);
router.route('/delete/:restaurant_name').delete(deleteRestaurantHandler);
router.route('/query').post(getQueryRestaurantHandler);

module.exports = router;