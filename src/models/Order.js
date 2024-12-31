const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    },
    pickup: {
        address: { type: String, required: true },
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true }
        }
    },
    delivery: {
        address: { type: String, required: true },
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true }
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
    price: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    pickedUpAt: Date,
    deliveredAt: Date
}, {
    timestamps: true
});

// Lokasyon indexleri
orderSchema.index({ 'pickup.location': '2dsphere' });
orderSchema.index({ 'delivery.location': '2dsphere' });

module.exports = mongoose.model('Order', orderSchema);
