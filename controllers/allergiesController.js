const allergiesModel = require('../models/allergiesModel');

const getAllAllergiesHandler = async (req, res) => {
    try {
        const allergies = await allergiesModel.find();
        res.status(200).json(allergies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

const createMultipleAllergiesHandler = async (req, res) => {
    try {
        if (!req.body.allergies) {
            res.status(400).json({ message: "Invalid request" });
        }
        for (let i = 0; i < req.body.allergies.length; i++) {
            const allergy = await allergiesModel.findOne({ allergy_name: req.body.allergies[i] });
            if (allergy) {
                res.status(400).json({ message: "Allergy already exists" });
            }
            else {
                allergiesModel.create({ allergy_name: req.body.allergies[i] });
            }
        }
        res.status(201).json({ message: "Allergies created" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = { getAllAllergiesHandler, createMultipleAllergiesHandler };