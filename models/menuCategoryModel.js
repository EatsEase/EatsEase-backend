const mongoose = require('mongoose');

const menuCategorySchema = new mongoose.Schema(
    {
        category_name: {
            type: String,
            required: true
        }
    },
    { collection: 'MenuCategory', versionKey: false }
);

const MenuCategory = mongoose.model('MenuCategory', menuCategorySchema);
module.exports = MenuCategory;