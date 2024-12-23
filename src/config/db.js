const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb://roadrunner-mongo:27017/mydatabase', { 
      useNewUrlParser: true,
      useUnifiedTopology: true,

    })
    .then(() => 
        console.log('MongoDB connected'))
    .catch((err) => 
        console.error('MongoDB connection error:', err));
};

module.exports = connectDB;