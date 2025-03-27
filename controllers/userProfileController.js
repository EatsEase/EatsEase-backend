const userProfileModel = require('../models/userProfileModel');
const userModel = require('../models/userModel');
const menuModel = require('../models/menuModel');
const historyModel = require('../models/historyModel');
const restaurantModel = require('../models/restaurantModel');

const getUserProfileHandler = async (req, res) => {
    try {
        const userProfile = await userProfileModel.findOne({ user_name: req.params.username });
        const user = await userModel.findOne({ user_name: req.params.username });

        if (userProfile && user) {
            const age = new Date().getFullYear() - new Date(userProfile.birthdate).getFullYear();
            return res.status(200).json({
                userProfile: userProfile,
                age: age,
                user_email: user.user_email,
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
            const menu = await menuModel.findOne({ menu_name: userProfile.current_liked_menu[i] }, {menu_name: 1, menu_image: 1});
            console.log(menu);
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

const updateLikedMenuHandler = async (req, res) => {
    try {
        const userProfile = await userProfileModel.findOne({ user_name: req.params.username });

        if (!userProfile) {
            return res.status(404).json({ message: "User Profile not found" });
        }

        if (userProfile.current_liked_menu.length === 5) {
            return res.status(409).json({ message: "Current Liked Menu is full" });
        }

        const updatedUserProfile = await userProfileModel.findOneAndUpdate(
            { user_name: req.params.username },
            { $push: { liked_menu: req.body.liked_menu, current_liked_menu: req.body.liked_menu }, $set : {"temp_recommended": []} },
            { new: true }
        );
        console.log(updatedUserProfile.current_liked_menu);

        return res.status(200).json({liked_menu: updatedUserProfile.liked_menu, current_liked_menu: updatedUserProfile.current_liked_menu, count: updatedUserProfile.current_liked_menu.length});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const deleteCurrentLikedMenuHandler = async (req, res) => {
    try {
        const userProfile = await userProfileModel.findOne({ user_name: req.params.username });
        const { menu_name } = req.body;

        if (!userProfile) {
            return res.status(404).json({ message: "User Profile not found" });
        }

        if (userProfile.current_liked_menu.includes(menu_name)) {
            const updatedUserProfile = await userProfileModel.findOneAndUpdate(
                { user_name: req.params.username },
                { $pull: { current_liked_menu: menu_name } },
                { new: true }
            );

            return res.status(200).json(updatedUserProfile);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const updateDislikedMenuHandler = async (req, res) => {
    try {
        const userProfile = await userProfileModel.findOne({ user_name: req.params.username });

        if (!userProfile) {
            return res.status(404).json({ message: "User Profile not found" });
        }

        const updatedUserProfile = await userProfileModel.findOneAndUpdate(
            { user_name: req.params.username },
            {
                $push: { disliked_menu: req.body.disliked_menu },
                $set: { temp_recommend: [] } // ✅ Reset recommendations
            },
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
            { $push: { finalized_menu: req.body.finalized_menu },
              $set: { current_finalized_menu: req.body.finalized_menu}
            },
            { new: true }
        );

        return res.status(200).json(updatedUserProfile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const updateFinalizeRestaurantHandler = async (req, res) => {
    try {
        const userProfile = await userProfileModel.findOne({ user_name: req.params.username });

        if (!userProfile) {
            return res.status(404).json({ message: "User Profile not found" });
        }

        const updatedUserProfile = await userProfileModel.findOneAndUpdate(
            { user_name: req.params.username },
            { $set: { current_finalized_restaurant: req.body.finalized_restaurant } },
            { new: true }
        );

        if (updatedUserProfile.current_finalized_menu != "" && updatedUserProfile.current_finalized_restaurant != "") {
            const clearCurrentLikedMenu = await userProfileModel.findOneAndUpdate(
                { user_name: req.params.username },
                { $set: { current_liked_menu: [] } },
                { new: true }
            );
            console.log(clearCurrentLikedMenu);
            const restaurant = await restaurantModel.findOne({ restaurant_name: updatedUserProfile.current_finalized_restaurant });
            if (!restaurant) {
                return res.status(404).json({ message: "Restaurant not found" });
            }
            const updatedHistory = await historyModel.findOneAndUpdate(
                { user_name: req.params.username },
                { $push: { history_detail: { menu_name: updatedUserProfile.current_finalized_menu, restaurant_name: updatedUserProfile.current_finalized_restaurant, restaurant_location: restaurant.restaurant_location, restaurant_location_link: restaurant.restaurant_location_link, date: Date.now() } } },
                { new: true }
            );
            console.log(updatedHistory);

            const formatted_json = {
                menu_name: updatedUserProfile.current_finalized_menu,
                restaurant: restaurant,
                date: new Date(Date.now())
            }

            return res.status(200).json(formatted_json);
        }

        return res.status(200).json(updatedUserProfile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const checkTokenHandler = async (req, res) => {
    try{
        console.log(req.user)
        return res.status(200).json({"token": "Not Expired"})
    }
    catch (error){
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}


module.exports = { getUserProfileHandler, updateUserProfileHandler, getCurrentLikedMenuHandler, deleteCurrentLikedMenuHandler, updateLikedMenuHandler, updateDislikedMenuHandler, updateFinalizedMenuHandler, updateFinalizeRestaurantHandler, checkTokenHandler };