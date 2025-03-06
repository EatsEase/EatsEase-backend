const userProfileModel = require('../models/userProfileModel');
const userModel = require('../models/userModel');
const menuModel = require('../models/menuModel');

const getUserProfileHandler = async (req, res) => {
    try {
        const userProfile = await userProfileModel.findOne({ user_name: req.params.username });
        const user = await userModel.findOne({ user_name: req.params.username });

        if (userProfile && user) {
            return res.status(200).json({
                userProfile: userProfile,
                created_date: user.created_date
            });
        }

        return res.status(404).json({ message: "User Profile not found" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateUserProfileHandler = async (req, res) => {
    try {
        const userProfile = await userProfileModel.findOne({ user_name: req.params.username });
        const { food_preferences, allergies, distance, price_range } = req.body;
        if (!userProfile) {
            res.status(404).json({ message: "User Profile not found" });
        }
        else {
            const updatedUserProfile = await userProfileModel.findOneAndUpdate({ user_name: req.params.username },
                { food_preferences: food_preferences, allergies: allergies, distance_in_km_preference: distance, price_range: price_range }
                , { new: true });
            res.status(200).json(updatedUserProfile);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

const getCurrentLikedMenuHandler = async (req, res) => {
    try {
        const userProfile = await userProfileModel.findOne({ user_name: req.params.username });

        if (!userProfile) {
            return res.status(404).json({ message: "User Profile not found" });
        }

        const menu_list = [];
        for (let i = 0; i < userProfile.current_liked_menu.length; i++) {
            const menu = await menuModel.findOne({ menu_name: userProfile.current_liked_menu[i] }, {menu_name: 1, menu_price: 0, menu_category: 0, menu_image: 1, _id: 0});
            menu_list.push(menu);
        }
        const count = userProfile.current_liked_menu.length;
        return res.status(200).json({
            menu_list: menu_list,
            count: count
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const updateCurrentLikedMenuHandler = async (req, res) => {
    try {
        const userProfile = await userProfileModel.findOne({ user_name: req.params.username });

        if (!userProfile) {
            return res.status(404).json({ message: "User Profile not found" });
        }

        if (userProfile.current_liked_menu.length === 5) {
            return res.status(400).json({ message: "Current Liked Menu is full" });
        }

        const updatedUserProfile = await userProfileModel.findOneAndUpdate(
            { user_name: req.params.username },
            { $push: { current_liked_menu: req.body.current_liked_menu } },
            { new: true }
        );

        return res.status(200).json({current_liked_menu: updatedUserProfile.current_liked_menu});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const updateLikedMenuHandler = async (req, res) => {
    try {
        const userProfile = await userProfileModel.findOne({ user_name: req.params.username });

        if (!userProfile) {
            return res.status(404).json({ message: "User Profile not found" });
        }

        const updatedUserProfile = await userProfileModel.findOneAndUpdate(
            { user_name: req.params.username },
            { $push: { liked_menu: req.body.liked_menu } },
            { new: true }
        );

        return res.status(200).json(updatedUserProfile.liked_menu);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const updateDislikedMenuHandler = async (req, res) => {
    try {
        const userProfile = await userProfileModel.findOne({ user_name: req.params.username });

        if (!userProfile) {
            return res.status(404).json({ message: "User Profile not found" });
        }

        const updatedUserProfile = await userProfileModel.findOneAndUpdate(
            { user_name: req.params.username },
            { $push: { disliked_menu: req.body.disliked_menu } },
            { new: true }
        );

        return res.status(200).json(updatedUserProfile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const updateFinalizedMenuHandler = async (req, res) => {
    try {
        const userProfile = await userProfileModel.findOne({ user_name: req.params.username });

        if (!userProfile) {
            return res.status(404).json({ message: "User Profile not found" });
        }

        const updatedUserProfile = await userProfileModel.findOneAndUpdate(
            { user_name: req.params.username },
            { $push: { finalized_menu: req.body.finalized_menu } },
            { new: true }
        );

        return res.status(200).json(updatedUserProfile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}


module.exports = { getUserProfileHandler, updateUserProfileHandler, getCurrentLikedMenuHandler, updateCurrentLikedMenuHandler, updateLikedMenuHandler, updateDislikedMenuHandler, updateFinalizedMenuHandler };