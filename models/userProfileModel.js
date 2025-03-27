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
        birthdate:{
            type: Date,
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
        current_finalized_menu:{
            type: String,
            default: ""
        },
        current_finalized_restaurant:{
            type: String,
            default: ""
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
        },
        temp_recommend:{
            type: Array,
            required: true,
            default: []
        }
    },
    { collection: 'UserProfile', versionKey: false }
);

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;