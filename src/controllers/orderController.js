const Order = require('../models/Order');
const Runner = require('../models/Runner');
const matchingService = require('../services/matchingService');
const notificationService = require('../services/notificationService');

class OrderController {
    // Tüm siparişleri getir
    async getAllOrders(req, res) {
        try {
            const orders = await Order.find({})
                .populate('runner', 'name phone currentLocation');
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Yeni sipariş oluştur
    async createOrder(req, res) {
        try {
            const order = new Order(req.body);
            
            // En uygun kuryeyi bul ve ata
            const availableRunner = await matchingService.findNextRunner(order);
            if (availableRunner) {
                await matchingService.assignOrder(order._id, availableRunner._id);
            }

            await order.save();
            res.status(201).json(order);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Sipariş durumunu güncelle
    async updateOrderStatus(req, res) {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Sipariş bulunamadı' });
            }

            const { status } = req.body;
            order.status = status;

            switch (status) {
                case 'pickedUp':
                    order.pickedUpAt = new Date();
                    await notificationService.notifyOrderPickedUp(order);
                    break;
                case 'delivered':
                    order.deliveredAt = new Date();
                    await notificationService.notifyOrderDelivered(order);
                    if (order.runner) {
                        await matchingService.releaseRunner(order.runner);
                    }
                    break;
            }

            await order.save();
            res.json(order);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new OrderController(); 