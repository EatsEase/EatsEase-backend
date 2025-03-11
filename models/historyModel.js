const mongoose = require('mongoose');

const historyDetailSchema = new mongoose.Schema(
    {
        menu_name:{
            type: String,
            required: true
        },
        restaurant_name:{
            type: String,
            required: true
        },
        restaurant_location:{
            type: String,
            required: true
        },
        date:{
            type: Date,
            required: true
        }
    },
);

const historySchema = new mongoose.Schema(
    {
        user_name:{
            type: String,
            required: true
        },
        history_detail:{
            type: [historyDetailSchema],
            required: true
        },
    },
    { collection: 'History', versionKey: false }
);

const History = mongoose.model('History', historySchema);
module.exports = History;