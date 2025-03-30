const restaurantModel = require("../models/restaurantModel");
const asyncHandler = require("express-async-handler");
const userProfileModel = require("../models/userProfileModel");
const { distance_to_km } = require("../utils/utils.js");

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

const createMultipleRestaurantHandler = asyncHandler(async (req, res) => {
    try {
        const { restaurant_list } = req.body;
        console.log(restaurant_list)

        if (!Array.isArray(restaurant_list) || restaurant_list.length === 0) {
            return res.status(400).json({ message: "restaurant_list must be a non-empty array" });
        }

        const created = await restaurantModel.insertMany(restaurant_list);
        res.status(201).json({ message: "Restaurants created successfully", restaurants: created });
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
    try {
        const { user_name, user_lat, user_long } = req.body;
        const userProfile = await userProfileModel.findOne({ user_name: user_name });

        if (!userProfile) {
            return res.status(404).json({ message: "User Profile not found" });
        }

        let restaurants = [];
        const max_distance = userProfile.distance_in_km_preference;

        // ✅ Helper function to calculate distance safely
        const calculateDistance = (restaurant) => {
            if (!restaurant || !restaurant.restaurant_latitude || !restaurant.restaurant_longtitude) {
                return Infinity; // Skip invalid data
            }

            const distance = distance_to_km(
                parseFloat(user_lat),
                parseFloat(user_long),
                parseFloat(restaurant.restaurant_latitude),
                parseFloat(restaurant.restaurant_longtitude)
            );

            return distance || Infinity;
        };

        // ✅ Helper to convert single object to array
        const toArray = (item) => (Array.isArray(item) ? item : item ? [item] : []);

        // ✅ Step 1: Try `menu + distance + price_range` (Best Match)
        let allRestaurants = await restaurantModel.find({
            restaurant_menu: { $in: [userProfile.current_finalized_menu] },
            $expr: { $lte: [{ $strLenCP: "$restaurant_price_range" }, userProfile.price_range.length] }
        });

        allRestaurants = toArray(allRestaurants);

        // ✅ Map and calculate distances correctly
        const mappedRestaurants = allRestaurants.map((restaurant) => ({
            ...restaurant.toObject(),
            distance: calculateDistance(restaurant)
        }));

        // ✅ Filter by max distance
        restaurants = mappedRestaurants.filter((r) => r.distance <= max_distance);

        // ✅ Step 2: If no match, try `menu + distance` (Ignore Price)
        if (restaurants.length === 0) {
            let menuMatchRestaurants = await restaurantModel.find({
                restaurant_menu: { $in: [userProfile.current_finalized_menu] }
            });

            menuMatchRestaurants = toArray(menuMatchRestaurants);

            // ✅ Map and calculate distances again
            const mappedDistanceOnly = menuMatchRestaurants.map((restaurant) => ({
                ...restaurant.toObject(),
                distance: calculateDistance(restaurant)
            }));

            // ✅ Filter by distance
            restaurants = mappedDistanceOnly.filter((r) => r.distance <= max_distance);
        }

        // ✅ Step 3: If no match, try `menu + price_range` (Ignore Distance)
        if (restaurants.length === 0) {
            let priceMatchRestaurants = await restaurantModel.find({
                restaurant_menu: { $in: [userProfile.current_finalized_menu] },
                $expr: { $lte: [{ $strLenCP: "$restaurant_price_range" }, userProfile.price_range.length] }
            });

            priceMatchRestaurants = toArray(priceMatchRestaurants);
            restaurants = priceMatchRestaurants.map((restaurant) => ({
                ...restaurant.toObject(),
                distance: calculateDistance(restaurant)
            }));
        }

        // ✅ Step 4: If still no match, fallback to `menu-only`
        if (restaurants.length === 0) {
            let menuOnlyRestaurants = await restaurantModel.find({
                restaurant_menu: { $in: [userProfile.current_finalized_menu] }
            });

            menuOnlyRestaurants = toArray(menuOnlyRestaurants);
            restaurants = menuOnlyRestaurants.map((restaurant) => ({
                ...restaurant.toObject(),
                distance: calculateDistance(restaurant)
            }));
        }

        // ✅ Step 5: Sort results by distance (Closest first)
        restaurants.sort((a, b) => a.distance - b.distance);

        // ✅ Return results or no matches
        if (restaurants.length === 0) {
            return res.status(404).json({ message: "No matching restaurants found." });
        }

        res.status(200).json(restaurants);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});



module.exports = { getAllRestaurantHandler, getRequestedRestaurantHandler, createRestaurantHandler, updateRestaurantHandler, deleteRestaurantHandler, getQueryRestaurantHandler, createMultipleRestaurantHandler };
