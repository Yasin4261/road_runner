const mongoose = require('mongoose');

const runnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: []
    },
    status: String,
    rating: Number,
    completedOrders: Number,
});

module.exports = mongoose.model('Runner', runnerSchema);