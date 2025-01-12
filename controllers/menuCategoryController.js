const menuCategoryModel = require("../models/menuCategoryModel");
const asyncHandler = require("express-async-handler");

const getAllMenuCategoriesHandler = asyncHandler(async (req, res) => {
    try {
        const menuCategories = await menuCategoryModel.find({}, { _id: 0 });
        if (menuCategories) {
        res.status(200).json(menuCategories);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
    });

const getRequestedMenuCategoriesHandler = asyncHandler(async (req, res) => {
    try {
        const menuCategory = await menuCategoryModel.findOne({ category_name: req.params.category_name });
        if (menuCategory) {
        res.status(200).json(menuCategory);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
    });

const createMenuCategoryHandler = asyncHandler(async (req, res) => {
    try {
        if (!req.body.category_name){
            res.status(400).json({ message: "Invalid body" });
        }
        const menuCategory = await menuCategoryModel.findOne({ category_name: req.body.category_name });
        if (menuCategory) {
            res.status(400).json({ message: "Menu Category already exists" });
        }
        else {
            const newMenuCategory = await menuCategoryModel.create(req.body);
            res.status(201).json(newMenuCategory);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
    });

const updateMenuCategoryHandler = asyncHandler(async (req, res) => {
    try {
        if (!req.body.category_name){
            res.status(400).json({ message: "Invalid body" });
        }
        const menuCategory = await menuCategoryModel.findOne({ category_name: req.params.category_name });
        if (menuCategory) {
            const updatedMenuCategory = await menuCategoryModel.findOneAndUpdate({ category_name: req.params.category_name }, req.body, { new: true });
            res.status(200).json(updatedMenuCategory);
        }
        else {
            res.status(404).json({ message: "Menu Category not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
    });

const deleteMenuCategoryHandler = asyncHandler(async (req, res) => {
    try {
        if (!req.body.category_name){
            res.status(400).json({ message: "Invalid body" });
        }
        const menuCategory = await menuCategoryModel.findOne({ category_name: req.params.category_name });
        if (menuCategory) {
            await menuCategoryModel.findOneAndDelete({ category_name: req.params.category_name });
            res.status(200).json({ message: "Menu Category deleted" });
        }
        else {
            res.status(404).json({ message: "Menu Category not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
    });

module.exports = { getAllMenuCategoriesHandler, getRequestedMenuCategoriesHandler, createMenuCategoryHandler, updateMenuCategoryHandler, deleteMenuCategoryHandler };