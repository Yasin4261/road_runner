const mongoose = require('mongoose');

const runnerSchema = new mongoose.Schema({
    name: String,
    password: String,
    phone: String,
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    },
    status: {
        type: String,
        enum: ['offline', 'online'],
        default: 'offline'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    vehicleType: {
        type: String,
        enum: ['bicycle', 'motorcycle', 'car'],
        default: 'bicycle'
    },
    identityNumber: String,
    email: String,
    earnings: {
        total: { type: Number, default: 0 },
        currentMonth: { type: Number, default: 0 }
    },
    workingHours: {
        shift: { type: String, enum: ['morning', 'evening', 'night'] },
        breakTimes: [Date]
    },
    currentStatus: {
        type: String,
        enum: ['offline', 'available', 'busy', 'onBreak'],
        default: 'offline'
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    queuePosition: {
        type: Number,
        default: null
    },
    lastLoginTime: {
        type: Date,
        default: null
    },
    shiftStartTime: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    lastLocationUpdate: {
        type: Date,
        default: Date.now
    }
});

runnerSchema.index({ "currentLocation": "2dsphere" });

module.exports = mongoose.model('Runner', runnerSchema);