const menuModel = require("../models/menuModel");
const menuCategoryModel = require("../models/menuCategoryModel");
const asyncHandler = require("express-async-handler");

const getAllMenuHandler = asyncHandler(async (req, res) => {
    try {
        const menus = await menuModel.find();
        res.status(200).json(menus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

const getRequestedMenuHandler = asyncHandler(async (req, res) => {
    try {
        const menu = await menuModel.findOne({ menu_name: req.params.menu_name });
        if (menu) {
        res.status(200).json(menu);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
    });

const createMenuHandler = asyncHandler(async (req, res) => {
    // Create a new menu item and check if the menu category exists
    // If it doesn't exist, create a new menu category
    try {
        if (!req.body.menu_name || !req.body.menu_price || !req.body.menu_category){
            res.status(400).json({ message: "Invalid request" });
        }
        const menu = await menuModel.findOne({ menu_name: req.body.menu_name });
        if (menu) {
            res.status(400).json({ message: "Menu already exists" });
        }
        for (let i = 0; i < req.body.menu_category.length; i++) {
            const category = await menuCategoryModel.findOne({ category_name: req.body.menu_category[i] });
            if (!category) {
                menuCategoryModel.create({ category_name: req.body.menu_category[i] });
            }
        }
        if (menuModel.validate(req.body)){
            const newMenu = await menuModel.create(req.body);
            res.status(201).json(newMenu);
        }
        else {
            res.status(400).json({ message: "Invalid request" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

const createMultipleMenuHandler = asyncHandler(async (req, res) => {
    try {
        // Extract menu_list from request body
        const { menu_list } = req.body;

        // Validate that menu_list exists and is an array
        if (!Array.isArray(menu_list) || menu_list.length === 0) {
            return res.status(400).json({ message: "Invalid request, menu_list must be a non-empty array" });
        }

        // Validate each menu item
        for (const menuItem of menu_list) {

            // Check if the menu already exists
            const existingMenu = await menuModel.findOne({ menu_name: menuItem.menu_name });
            if (existingMenu) {
                return res.status(400).json({ message: `Menu with name "${menuItem.menu_name}" already exists` });
            }

            // Check and create missing categories
            for (const categoryName of menuItem.menu_category) {
                let category = await menuCategoryModel.findOne({ category_name: categoryName });
                if (!category) {
                    await menuCategoryModel.create({ category_name: categoryName });
                }
            }
        }

        // Insert all validated menu items into the database
        const newMenus = await menuModel.insertMany(menu_list);
        
        res.status(201).json({ message: "Menus created successfully", menus: newMenus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});


const updateMenuHandler = asyncHandler(async (req, res) => {
    try {
        if (!req.body.menu_name || !req.body.menu_price || !req.body.menu_category){
            res.status(400).json({ message: "Invalid request" });
        }
        const menu = await menuModel.findOne({ menu_name: req.params.menu_name });
        if (menu) {
            const updatedMenu = await menuModel.findOneAndUpdate({ menu_name: req.params.menu_name }, req.body, { new: true });
            res.status(200).json(updatedMenu);
        }
        else {
            res.status(404).json({ message: "Menu not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

const deleteMenuHandler = asyncHandler(async (req, res) => {
    try {
        if (!req.body.menu_name || !req.body.menu_price || !req.body.menu_category){
            res.status(400).json({ message: "Invalid request" });
        }
        const menu = await menuModel.findOne({ menu_name: req.params.menu_name });
        if (menu) {
            await menuModel.deleteOne({ menu_name: req.params.menu_name });
            res.status(200).json({ message: "Menu deleted" });
        }
        else {
            res.status(404).json({ message: "Menu not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = { getAllMenuHandler, getRequestedMenuHandler, createMenuHandler, createMultipleMenuHandler, updateMenuHandler, deleteMenuHandler };
