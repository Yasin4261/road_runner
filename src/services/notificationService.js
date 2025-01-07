class NotificationService {
    async notifyNewOrder(order) {
        try {
            // Burada gerçek bildirim mantığı olacak (Socket.io, Push notification vs.)
            console.log('Yeni sipariş bildirimi:', {
                orderId: order._id,
                runnerId: order.runner,
                status: order.status
            });
            return true;
        } catch (error) {
            console.error('Bildirim gönderme hatası:', error);
            return false;
        }
    }

    async notifyOrderPickedUp(order) {
        try {
            console.log('Sipariş alındı bildirimi:', {
                orderId: order._id,
                runnerId: order.runner,
                status: 'pickedUp'
            });
            return true;
        } catch (error) {
            console.error('Bildirim gönderme hatası:', error);
            return false;
        }
    }

    async notifyOrderDelivered(order) {
        try {
            console.log('Sipariş teslim edildi bildirimi:', {
                orderId: order._id,
                runnerId: order.runner,
                status: 'delivered'
            });
            return true;
        } catch (error) {
            console.error('Bildirim gönderme hatası:', error);
            return false;
        }
    }

    async notifyRunnerLocation(runnerId, location) {
        try {
            console.log('Kurye konum bildirimi:', {
                runnerId,
                location
            });
            return true;
        } catch (error) {
            console.error('Bildirim gönderme hatası:', error);
            return false;
        }
    }

    async notifyOrderStatusUpdate(order) {
        try {
            console.log('Sipariş durumu güncelleme bildirimi:', {
                orderId: order._id,
                runnerId: order.runner,
                status: order.status,
                statusHistory: order.statusHistory[order.statusHistory.length - 1],
                updatedAt: new Date()
            });
            return true;
        } catch (error) {
            console.error('Bildirim gönderme hatası:', error);
            return false;
        }
    }
}

module.exports = new NotificationService();
