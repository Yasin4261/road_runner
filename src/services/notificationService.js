const queueService = require('./queueService');

class NotificationService {
    constructor(socketService) {
        this.socketService = socketService;
    }

    async send(notification) {
        const runner = await Runner.findById(notification.runnerId);
        if (runner) {
            this.socketService.notifyRunner(runner, notification);
        }
    }

    notifyNewOrder(order) {
        const message = {
            type: 'newOrder',
            title: 'Yeni Sipariş',
            body: `Sipariş ID: ${order._id}`,
            orderId: order._id,
            customerName: order.customer.name,
            customerAddress: order.customer.address,
            orderDetails: order.orderDetails,
            price: order.price
        };
        queueService.enqueue(message);
    }

    notifyOrderPickedUp(order) {
        const message = {
            type: 'orderPickedUp',
            title: 'Sipariş Alındı',
            body: `Sipariş ID: ${order._id}`,
            orderId: order._id
        };
        queueService.enqueue(message);
    }

    notifyOrderDelivered(order) {
        const message = {
            type: 'orderDelivered',
            title: 'Sipariş Teslim Edildi',
            body: `Sipariş ID: ${order._id}`,
            orderId: order._id
        };
        queueService.enqueue(message);
    }

    notifyRunnerLocation(runnerId, location) {
        const message = {
            type: 'runnerLocationUpdate',
            title: 'Kurye Konum Güncellemesi',
            body: `Kurye ID: ${runnerId}`,
            runnerId: runnerId,
            location: location
        };
        queueService.enqueue(message);
    }

    notifyOrderStatusUpdate(order) {
        const message = {
            type: 'orderStatusUpdate',
            title: 'Sipariş Durumu Güncellemesi',
            body: `Sipariş ID: ${order._id}, Durum: ${order.status}`,
            orderId: order._id,
            status: order.status
        };
        queueService.enqueue(message);
    }
}

module.exports = new NotificationService();
