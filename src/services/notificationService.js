class NotificationService {
    constructor() {
        this.notifications = new Map();
    }

    async sendToRunner(runnerId, message) {
        // Kuryelere bildirim gönder
        console.log(`Kurye ${runnerId} için bildirim: ${message}`);
        // SMS, Push Notification vs. entegrasyonu buraya eklenebilir
    }

    async sendToCustomer(orderId, message) {
        // Müşteriye bildirim gönder
        console.log(`Sipariş ${orderId} için müşteri bildirimi: ${message}`);
        // SMS, Email vs. entegrasyonu buraya eklenebilir
    }

    async notifyOrderAssigned(order, runner) {
        await this.sendToRunner(runner._id, `Yeni siparişiniz var: ${order._id}`);
        await this.sendToCustomer(order._id, 'Siparişiniz bir kuryeye atandı');
    }

    async notifyOrderPickedUp(order) {
        await this.sendToCustomer(order._id, 'Siparişiniz alındı, yola çıktı');
    }

    async notifyOrderDelivered(order) {
        await this.sendToCustomer(order._id, 'Siparişiniz teslim edildi');
    }
}

module.exports = new NotificationService();
