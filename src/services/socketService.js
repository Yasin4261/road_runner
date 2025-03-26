const Runner = require('../models/Runner');

class SocketService {
    constructor(io) {
        this.io = io;
        this.runners = new Map(); // Kurye bağlantılarını saklamak için bir harita

        io.on('connection', (socket) => {
            console.log('Yeni bağlantı:', socket.id);

            socket.on('registerRunner', (runnerId) => {
                this.runners.set(runnerId, socket.id);
                console.log(`Kurye ${runnerId} kayıt oldu: ${socket.id}`);
            });

            socket.on('disconnect', () => {
                for (let [runnerId, socketId] of this.runners.entries()) {
                    if (socketId === socket.id) {
                        this.runners.delete(runnerId);
                        console.log(`Kurye ${runnerId} bağlantısı kesildi: ${socket.id}`);
                        break;
                    }
                }
            });
        });
    }

    notifyRunner(runnerId, message) {
        const socketId = this.runners.get(runnerId);
        if (socketId) {
            this.io.to(socketId).emit('notification', message);
            console.log(`Kurye ${runnerId} bildirimi gönderildi:`, message);
        } else {
            console.log(`Kurye ${runnerId} bağlantısı bulunamadı`);
        }
    }
}

module.exports = SocketService;
