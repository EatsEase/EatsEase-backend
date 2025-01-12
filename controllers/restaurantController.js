const express = require("express");
const asyncHandler = require("express-async-handler");

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
        res.status(201).json(restaurant);
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

module.exports = { getAllRestaurantHandler, getRequestedRestaurantHandler, createRestaurantHandler, updateRestaurantHandler, deleteRestaurantHandler };
