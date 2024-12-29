const WebSocket = require('ws');
const Runner = require('../models/Runner');

class SocketService {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log('Yeni WebSocket bağlantısı');

            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message);
                    
                    if (data.type === 'location_update') {
                        await this.handleLocationUpdate(data);
                    }
                } catch (error) {
                    console.error('WebSocket hatası:', error);
                }
            });

            ws.on('close', () => {
                console.log('WebSocket bağlantısı kapandı');
            });

            ws.on('error', (error) => {
                console.error('WebSocket hatası:', error);
            });
        });
    }

    async handleLocationUpdate(data) {
        const { runnerId, coordinates } = data;
        
        try {
            // Kurye konumunu güncelle
            await Runner.findByIdAndUpdate(runnerId, {
                'currentLocation.coordinates': coordinates,
                lastLocationUpdate: new Date()
            });

            // Tüm bağlı clientlara konum güncellemesini gönder
            this.broadcast(JSON.stringify({
                type: 'runner_location',
                runnerId,
                coordinates,
                timestamp: new Date()
            }));
        } catch (error) {
            console.error('Konum güncelleme hatası:', error);
        }
    }

    broadcast(message) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    sendToRunner(runnerId, message) {
        this.broadcast(JSON.stringify({
            type: 'runner_notification',
            runnerId,
            message
        }));
    }

    sendToCustomer(orderId, message) {
        this.broadcast(JSON.stringify({
            type: 'customer_notification',
            orderId,
            message
        }));
    }
}

module.exports = SocketService;
