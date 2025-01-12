const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
    {
        user_name:{
            type: String,
            required: true
        },
        food_preferences:{
            type: Array,
            required: true
        },
        distance_in_km_preference:{
            type: Number,
            required: true
        },
        allergies:{
            type: Array,
            required: true
        },
        liked_menu:{
            type: Array,
            required: true
        },
        disliked_menu:{
            type: Array,
            required: true
        },
    },
    { collection: 'UserProfile', versionKey: false }
);

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;