const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
    {
        menu_name: {
            type: String,
            required: true
        },
        menu_price: {
            type: Number,
            required: true
        },
        menu_category: {
            type: [String],
            required: true
        },
    },
    { collection: 'Menu' , versionKey: false}

);

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;