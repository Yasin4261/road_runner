const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const SocketService = require('./services/socketService');
const MatchingService = require('./services/matchingService');
const notificationService = require('./services/notificationService');
const runnerRoutes = require('./routes/runner');
const orderRoutes = require('./routes/order');
const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const swaggerSetup = require('./config/swagger');

const app = express();
const server = http.createServer(app);

// Body parser middleware'lerini en başa al
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS ayarlarını ekle
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// MongoDB bağlantısı
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/courier_db';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB bağlantısı başarılı');
    })
    .catch((err) => {
        console.error('MongoDB bağlantı hatası:', err);
    });

// WebSocket service'ini başlat
const socketService = new SocketService(server);

/// Swagger UI
swaggerSetup(app);

// Routes
app.use('/api/runners', runnerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/auth', authRoutes);
app.use('/', healthRoutes); // Health check rotasını ekleyin

// Swagger dökümantasyonunu ekleyin
swaggerSetup(app);

// Temel endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Courier API is running',
        docs: '/api-docs'
    });
});

// Test route'u
app.get('/test', (req, res) => {
    res.json({ message: 'API çalışıyor' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Sunucu hatası!',
        message: err.message 
    });
});

// Port dinleme
const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});

module.exports = server;
