const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
    {
        user_name:{
            type: String,
            required: true
        },
        menu_name:{
            type: String,
            required: true
        },
        menu_price:{
            type: Number,
            required: true
        },
        date:{
            type: Date,
            required: true
        }
    },
    { collection: 'History', versionKey: false }
);

const History = mongoose.model('History', historySchema);
module.exports = History;