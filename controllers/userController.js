const userModel = require('../models/userModel');
const historyModel = require('../models/historyModel');
const userProfileModel = require('../models/userProfileModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const signupHandler = asyncHandler(async (req, res) => {
    // Signup and create history, user profile as a default
    try {
        const { user_name, user_email, user_password, gender, birthdate } = req.body;
        const email = await userModel.findOne({ user_email: user_email });
        const username = await userModel.findOne({ user_name: user_name });
        
        const dateBE = birthdate;
        const [day, month, yearBE] = dateBE.split("/").map(Number);
        const yearAD = yearBE - 543; // Convert BE to AD
        const birthdateFormat = new Date(yearAD, month - 1, day);
        if (email) {
            res.status(400).json({ message: 'User email already exists' });
        } else if (username) {
            res.status(400).json({ message: 'User name already exists' });
        } else {
            const newUser = await userModel.create({
                user_name: user_name,
                user_email: user_email,
                user_password: bcrypt.hashSync(user_password, 10),
                created_date: Date.now()
            });

            const createHistory = await historyModel.create({ user_name: user_name, history_detail: [] });
            const createUserProfile = await userProfileModel.create({ user_name: user_name, gender: gender, birthdate: birthdateFormat, food_preferences:[], allergies:[], distance_in_km_preference: 5, price_range: "฿", liked_menu: [], disliked_menu: [], finalized_menu: [] });
            console.log("History of user: "+ user_name + "was successfully created"+ createHistory);
            console.log("User Profile of user: "+ user_name + "was successfully created"+ createUserProfile);
            res.status(201).json(newUser);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
);

const loginHandler = asyncHandler(async (req, res) => {
    try {
        const { user_name, user_password } = req.body;
        const user = await userModel.findOne({ user_name: user_name });
        if (user && bcrypt.compareSync(user_password, user.user_password)) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.status(200).json({ user: user.user_name, token });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
);

module.exports = { signupHandler, loginHandler };