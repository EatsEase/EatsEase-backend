const menuModel = require("../models/menuModel");
const asyncHandler = require("express-async-handler");

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
    console.log(menuModel);
    try {
        if (!req.body.menu_name || !req.body.menu_price || !req.body.menu_category){
            res.status(400).json({ message: "Invalid request" });
        }
        const menu = await menuModel.findOne({ menu_name: req.body.menu_name });
        if (menu) {
            res.status(400).json({ message: "Menu already exists" });
        }
        else if (menuModel.validate(req.body)){
            const newMenu = await menuModel.create(req.body);
            res.status(201).json(newMenu);
        }
        res.status(201).json(menu);
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

module.exports = { getRequestedMenuHandler, createMenuHandler, updateMenuHandler, deleteMenuHandler };
