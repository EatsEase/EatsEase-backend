const restaurantModel = require("../models/restaurantModel");
const asyncHandler = require("express-async-handler");
const userProfileModel = require("../models/userProfileModel");

const getAllRestaurantHandler = asyncHandler(async (req, res) => {
    try {
        const restaurants = await restaurantModel.find();
        res.status(200).json(restaurants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

const getRequestedRestaurantHandler = asyncHandler(async (req, res) => {
    try {
        const restaurant = await restaurantModel.findOne({restaurant_name: req.params.restaurant_name,});
        if (restaurant) {
        res.status(200).json(restaurant);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

const createRestaurantHandler = asyncHandler(async (req, res) => {
    try {
        if (!req.body.restaurant_name || !req.body.restaurant_location || !req.body.restaurant_rating){
            res.status(400).json({ message: "Invalid request" });
        }
        const restaurant = await restaurantModel.findOne({ restaurant_name: req.body.restaurant_name });
        if (restaurant) {
            res.status(400).json({ message: "Restaurant already exists" });
        }
        else if (restaurantModel.validate(req.body)){
            const newRestaurant = await restaurantModel.create(req.body);
            res.status(201).json(newRestaurant);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

const updateRestaurantHandler = asyncHandler(async (req, res) => {
    try {
        if (!req.body.restaurant_name || !req.body.restaurant_location || !req.body.restaurant_rating){
            res.status(400).json({ message: "Invalid request" });
        }
        const restaurant = await restaurantModel.findOne({ restaurant_name: req.params.restaurant_name });
        if (restaurant) {
            const updatedRestaurant = await restaurantModel.findOneAndUpdate({ restaurant_name: req.params.restaurant_name }, req.body, { new: true });
            res.status(200).json(updatedRestaurant);
        }
        else {
            res.status(404).json({ message: "Restaurant not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

const deleteRestaurantHandler = asyncHandler(async (req, res) => {
    try {
        if (!req.body.restaurant_name || !req.body.restaurant_location || !req.body.restaurant_rating){
            res.status(400).json({ message: "Invalid request" });
        }
        const restaurant = await restaurantModel.findOne({ restaurant_name: req.params.restaurant_name });
        if (restaurant) {
            const deletedRestaurant = await restaurantModel.findOneAndDelete({ restaurant_name: req.params.restaurant_name });
            res.status(200).json(deletedRestaurant);
        }
        else {
            res.status(404).json({ message: "Restaurant not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});


const getQueryRestaurantHandler = asyncHandler(async (req, res) => {
    //handle price_range, distance, menu query
    try {
        const { user_name, user_lat, user_long } = req.body;
        const userProfile = await userProfileModel.findOne({ user_name: user_name });
        if (!userProfile) {
            return res.status(404).json({ message: "User Profile not found" });
        }

        //calculate distance in km
        const haversineDistance = (lat1, lon1, lat2, lon2) => {
            const toRadians = (angle) => (angle * Math.PI) / 180;
            
            const R = 6371; // Radius of Earth in kilometers
            const dLat = toRadians(lat2 - lat1);
            const dLon = toRadians(lon2 - lon1);
        
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                      Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return parseFloat((R * c).toFixed(2)); // Round to 2 decimal places
        };

        const restaurants = await restaurantModel.find();
        const mapped_restaurants = restaurants.map(restaurant => {
            //calculate distance and round it to 2 decimal places
            const distance = haversineDistance(user_lat, user_long, restaurant.restaurant_latitude, restaurant.restaurant_longtitude);
            return {restaurant, distance};
        });
        res.status(200).json(mapped_restaurants);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = { getAllRestaurantHandler, getRequestedRestaurantHandler, createRestaurantHandler, updateRestaurantHandler, deleteRestaurantHandler, getQueryRestaurantHandler };
