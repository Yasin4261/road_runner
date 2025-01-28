const Order = require('../models/Order');
const Runner = require('../models/Runner');
const notificationService = require('./notificationService');

class MatchingService {
    async findNextRunner(order) {
        // Sıradaki müsait kuryeyi bul
        const nextRunner = await Runner.findOne({
            currentStatus: 'available',
            queuePosition: { $ne: null }
        }).sort({ queuePosition: 1 });

        if (!nextRunner) {
            throw new Error('No available runners in queue');
        }

        return nextRunner;
    }

    async assignOrder(orderId, runnerId) {
        const [order, runner] = await Promise.all([
            Order.findById(orderId),
            Runner.findById(runnerId)
        ]);

        if (!order || !runner) {
            throw new Error('Order or runner not found');
        }

        // Siparişi ata
        order.status = 'assigned';
        order.runner = runnerId;
        order.assignedAt = new Date();

        // Kurye durumunu güncelle
        runner.currentStatus = 'busy';
        runner.activeOrder = orderId;

        // Kuryeyi kuyruktan çıkar
        const oldPosition = runner.queuePosition;
        runner.queuePosition = null;

        await Promise.all([
            order.save(),
            runner.save(),
            // Diğer kuryelerin pozisyonlarını güncelle
            Runner.updateMany(
                { queuePosition: { $gt: oldPosition } },
                { $inc: { queuePosition: -1 } }
            )
        ]);

        // Bildirimleri gönder
        await notificationService.notifyOrderAssigned(order, runner);

        return order;
    }

    calculateDistance(coord1, coord2) {
        const R = 6371; // Dünya'nın yarıçapı (km)
        const lat1 = this.toRad(coord1[1]);
        const lat2 = this.toRad(coord2[1]);
        const dLat = this.toRad(coord2[1] - coord1[1]);
        const dLon = this.toRad(coord2[0] - coord1[0]);

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    toRad(value) {
        return value * Math.PI / 180;
    }
}

module.exports = new MatchingService();
