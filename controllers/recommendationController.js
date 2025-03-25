const asyncHandler = require("express-async-handler");
const userProfileModel = require("../models/userProfileModel");
const menuModel = require("../models/menuModel");
const axios = require("axios")


const nextMealHandler = asyncHandler(async (req, res) => {
    try{
        const userProfile = await userProfileModel.findOne({ user_name: req.params.username });
        if (!userProfile) {
            return res.status(404).json({ message: "User Profile not found" });
        }
        const response = await axios.get(`https://eatsease-model.onrender.com/api/recommendation/next_meal/${req.params.username}`);

        const menu = await menuModel.findOne({ menu_name: response.data.menu_name });
        if (!menu) {
            return res.status(404).json({ message: "Menu not found" });
        }

        return res.status(200).json({"recommended_menu": menu.menu_name, "menu_image": menu.menu_image});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

const recommendMenuHandler = asyncHandler(async (req, res) => {
    try {
        const userProfile = await userProfileModel.findOne({ user_name: req.params.username });
        if (!userProfile) {
            return res.status(404).json({ message: "User not found" });
        }

        const response = await axios.get(`https://eatsease-model.onrender.com/api/recommendation/menu/${req.params.username}`);
        const recommendedMenus = response.data.results.map(item => item.menu_name);
        const matchedMenus = await menuModel.find(
            { menu_name: { $in: recommendedMenus } },
        );
        res.status(200).json(matchedMenus);
        }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = { nextMealHandler, recommendMenuHandler };