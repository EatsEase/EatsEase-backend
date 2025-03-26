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

        const dateBE = birthdate.replace(" BE", "");
        const [day, month, yearBE] = dateBE.split("/").map(Number);
        console.log(day, month, yearBE);
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
            const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.status(200).json({ user: user.user_name, token });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
);

const guestHandler = asyncHandler(async (req, res) => {
    try {
        let guestUsername;
        let exists = true;
        let attempts = 0;
        
        // Generate a unique guest username: "guest" + 10 random digits
        while (exists && attempts < 5) {
            // Generate 10 random digits (as a string, padded if necessary)
            const randomDigits = Math.floor(Math.random() * 1e10)
                .toString()
                .padStart(10, '0');
            guestUsername = `guest${randomDigits}`;
            
            // Check if this username already exists
            const existingUser = await userModel.findOne({ user_name: guestUsername });
            if (!existingUser) {
                exists = false;
            }
            attempts++;
        }
        
        if (exists) {
            return res.status(500).json({ message: "Failed to generate a unique guest username." });
        }
        
        // Set guest email and password (password is the same as username)
        const guestEmail = `${guestUsername}@gmail.com`;
        const hashedPassword = bcrypt.hashSync(guestUsername, 10);
        
        // Create the guest user in the user collection
        const newGuestUser = await userModel.create({
            user_name: guestUsername,
            user_email: guestEmail,
            user_password: hashedPassword,
            created_date: Date.now()
        });
        
        // Create a default history document for the guest
        const createHistory = await historyModel.create({
            user_name: guestUsername,
            history_detail: []
        });
        
        // Create a default user profile document for the guest
        const createUserProfile = await userProfileModel.create({
            user_name: guestUsername,
            gender: "Not specified",
            birthdate: Date.now(), // current date/time
            food_preferences: [],
            allergies: [],
            distance_in_km_preference: 5,
            price_range: "฿",
            liked_menu: [],
            disliked_menu: [],
            finalized_menu: []
        });
        console.log("History of user: "+ guestUsername + "was successfully created"+ createHistory);
        console.log("User Profile of user: "+ guestUsername + "was successfully created"+ createUserProfile);
        
        // Generate a JWT token for the guest user (expires in 1 day)
        const token = jwt.sign({ id: newGuestUser._id, role:"guest" }, process.env.JWT_SECRET, { expiresIn: '60s' });
        
        res.status(200).json({ user: guestUsername, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

const logoutHandler = asyncHandler(async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Token is required for logout' });
        }
        
        // Verify the token
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        console.log(decoded)

        if (decoded.role === 'user'){
            return res.status(200).json({message: 'user logged out'})
        }
        
        // Find the guest user by their ID (from token payload)
        const guestUser = await userModel.findById(decoded.id);
        if (!guestUser) {
            return res.status(404).json({ message: 'Guest user not found' });
        }
        console.log(guestUser)
        
        // Remove the guest user and their related data
        await userModel.findByIdAndDelete(decoded.id);
        await historyModel.deleteOne({ user_name: guestUser.user_name });
        await userProfileModel.deleteOne({ user_name: guestUser.user_name });
        
        res.status(200).json({ message: 'Guest user logged out and all related data removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during logout' });
    }
});

module.exports = { signupHandler, loginHandler, guestHandler, logoutHandler };