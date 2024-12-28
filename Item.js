const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    // Add more fields as needed
});

module.exports = mongoose.model('Item', ItemSchema);