const express = require('express');

const runnerRoutes = require('./routes/runnerRoutes');


const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(express.json());

app.use('/api/v1/runner', runnerRoutes);

module.exports = app;