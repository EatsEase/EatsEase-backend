const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
    {
        restaurant_name: {
            type: String,
            required: true
        },
        restaurant_rating:{
            type: Number,
            required: true
        },
        restaurant_price_range:{
            type: String,
            required: true
        },
        restaurant_location:{
            type: String,
            required: true
        },
        restaurant_latitude:{
            type: Number,
            required: true
        },
        restaurant_longtitude:{
            type: Number,
            required: true
        },
        restaurant_location_link:{
            type: String,
            required: true
        },
        restaurant_description:{
            type: String,
            required: true
        },
        restaurant_image:{
            type: String,
            required: true
        },
        restaurant_menu:{
            type: Array,
            required: true
        }

    },
    { collection: 'Restaurant', versionKey: false }

);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;