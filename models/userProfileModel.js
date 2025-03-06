const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
    {
        user_name:{
            type: String,
            required: true
        },
        gender:{
            type: String,
        },
        age:{
            type: Number,
        },
        food_preferences:{
            type: Array,
            required: true
        },
        distance_in_km_preference:{
            type: Number,
            required: true
        },
        price_range:{
            type: String,
            required: true
        },
        allergies:{
            type: Array,
            required: true
        },
        current_liked_menu:{
            type: Array,
            default: []
        },
        liked_menu:{
            type: Array,
            required: true
        },
        disliked_menu:{
            type: Array,
            required: true
        },
        finalized_menu:{
            type: Array,
            required: true
        }
    },
    { collection: 'UserProfile', versionKey: false }
);

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;