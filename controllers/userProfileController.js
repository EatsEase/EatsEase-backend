const userProfileModel = require('../models/userProfileModel');

const getUserProfileHandler = async (req, res) => {
    try {
        const userProfile = await userProfileModel.findOne({ username: req.params.username });
        if (userProfile) {
            res.status(200).json(userProfile);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

const updateUserProfileHandler = async (req, res) => {
    try {
        const userProfile = await userProfileModel.findOne({ username: req.params.username });
        if (userProfile && userProfile.validate(req.body)) {
            const updatedUserProfile = await userProfileModel.findOneAndUpdate({ username: req.params.username }, req.body, { new: true });
            res.status(200).json(updatedUserProfile);
        }
        else {
            res.status(404).json({ message: "User Profile not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

const updateReactionToMenuHandler = async (req, res) => {
    //ทำเพึ่มห้ามมี liked_menu ใน disliked_menu
    try {
        const userProfile = await userProfileModel.findOne({ username: req.params.username });
        if (userProfile) {
            //update only like and dislike
            if (!req.body.liked_menu || !req.body.disliked_menu) {
                res.status(400).json({ message: "Invalid request" });
            }
            else {
                userProfile.liked_menu = req.body.liked_menu;
                userProfile.disliked_menu = req.body.disliked_menu;
                const updatedUserProfile = await userProfileModel.findOneAndUpdate({ username: req.params.username }, userProfile, { new: true });
                res.status(200).json(updatedUserProfile);
            }
        }
        else {
            res.status(404).json({ message: "User Profile not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = { getUserProfileHandler, updateUserProfileHandler, updateReactionToMenuHandler };