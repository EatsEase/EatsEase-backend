const asyncHandler = require("express-async-handler");
const userProfileModel = require("../models/userProfileModel");
const menuModel = require("../models/menuModel");


const nextMealHandler = asyncHandler(async (req, res) => {
    try{
        const userProfile = await userProfileModel.findOne({ user_name: req.params.username });
        if (!userProfile) {
            return res.status(404).json({ message: "User Profile not found" });
        }
        //TODO add model logic here
        const lst_result = ["ข้าวคอหมูทอดน้ำปลา", "ข้าวผัดไข่", "ข้าวไก่ทอด"];
        const result = lst_result[Math.floor(Math.random() * lst_result.length)];
        const menu = await menuModel.findOne({ menu_name: result });
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
        const menus = await menuModel.find();
        res.status(200).json(menus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = { nextMealHandler, recommendMenuHandler };