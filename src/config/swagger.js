const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Courier API',
            version: '1.0.0',
            description: 'Kurye yönetim sistemi API dokümantasyonu',
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Route dosyalarını tara
};

module.exports = swaggerJsdoc(options);
