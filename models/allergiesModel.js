const mongoose = require('mongoose');

const allergiesSchema = new mongoose.Schema(
    {
        allergy_name: {
            type: String,
            required: true
        }
    },
    { collection: 'Allergies', versionKey: false }
);

const Allergies = mongoose.model('Allergies', allergiesSchema);
module.exports = Allergies;