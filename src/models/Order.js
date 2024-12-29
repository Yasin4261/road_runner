const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        name: String,
        phone: String,
        address: String
    },
    pickup: {
        address: String,
        location: {
            type: { type: String, default: 'Point' },
            coordinates: [Number]
        }
    },
    delivery: {
        address: String,
        location: {
            type: { type: String, default: 'Point' },
            coordinates: [Number]
        }
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'pickedUp', 'delivered', 'cancelled'],
        default: 'pending'
    },
    runner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Runner'
    },
    price: Number,
    distance: Number,
    createdAt: { type: Date, default: Date.now },
    assignedAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date
});

orderSchema.index({ "pickup.location": "2dsphere" });
orderSchema.index({ "delivery.location": "2dsphere" });

module.exports = mongoose.model('Order', orderSchema);
