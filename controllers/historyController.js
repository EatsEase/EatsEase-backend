const historyModel = require('../models/historyModel');

const getHistoryHandler = async (req, res) => {
    try {
        const history = await historyModel.findOne({ username: req.params.username });
        if (history) {
            res.status(200).json(history);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

const createHistoryHandler = async (req, res) => {
    try {
        const history = await historyModel.findOne({ username: req.params.username });
        if (history) {
            res.status(400).json({ message: "History already exists" });
        }
        else {
            const newHistory = await historyModel.create({ username: req.params.username, history_detail: [] });
            res.status(201).json(newHistory);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

const updateHistoryHandler = async (req, res) => {
    try {
        const history = await historyModel.findOne({ username: req.params.username });
        if (history) {
            const updatedHistory = await historyModel.findOneAndUpdate({ username: req.params.username }, {$push:{history_detail:req.body}}, { new: true });
            res.status(200).json(updatedHistory);
        }
        else {
            res.status(404).json({ message: "History not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

const deleteHistoryHandler = async (req, res) => {
    try {
        const history = await historyModel.findOne({ username: req.params.username });
        if (history) {
            const updatedHistory = await historyModel.findOneAndUpdate({ username: req.params.username }, {history_detail:[]}, { new: true });
            res.status(200).json(updatedHistory);
        }
        else {
            res.status(404).json({ message: "History not found" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = { getHistoryHandler, createHistoryHandler, updateHistoryHandler, deleteHistoryHandler };