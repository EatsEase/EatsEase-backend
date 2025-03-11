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
        // const userProfile = await userProfileModel.findOne({ user_name: req.params.username });
        // if (!userProfile) {
        //     return res.status(404).json({ message: "User Profile not found" });
        // }
        const restaurants = await restaurantModel.find();
        const formatted_restaurants = restaurants.map(restaurant => ({restaurant_name: restaurant.restaurant_name, restaurant_location: restaurant.restaurant_location, lat: restaurant.restaurant_latitude, long: restaurant.restaurant_longtitude}))
        res.status(200).json(formatted_restaurants);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = { getAllRestaurantHandler, getRequestedRestaurantHandler, createRestaurantHandler, updateRestaurantHandler, deleteRestaurantHandler, getQueryRestaurantHandler };
