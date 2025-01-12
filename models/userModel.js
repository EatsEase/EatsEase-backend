const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        user_name: {
            type: String,
            required: true
        },
        user_email: {
            type: String,
            required: true
        },
        user_password: {
            type: String,
            required: true
        },
    },
    { collection: 'User', versionKey: false }

);

const User = mongoose.model('User', userSchema);
module.exports = User;