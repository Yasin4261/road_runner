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
            console.log('Yeni sipariş isteği alındı:', req.body);

            // Önce müsait kurye var mı kontrol et
            const availableRunner = await Runner.findOne({
                currentStatus: 'available',
                shiftStartTime: { $ne: null }  // Vardiyada olmalı
            }).sort({ queuePosition: 1 });  // Kuyrukta ilk sıradaki

            console.log('Müsait kurye:', availableRunner);

            // Yeni siparişi oluştur
            const order = new Order({
                ...req.body,
                status: 'pending',
                createdAt: new Date()
            });

            // Eğer müsait kurye varsa siparişi ata
            if (availableRunner) {
                order.runner = availableRunner._id;
                order.status = 'assigned';
                
                // Kurye durumunu güncelle
                availableRunner.currentStatus = 'busy';
                availableRunner.activeOrder = order._id;

                console.log('Sipariş kuryeye atanıyor:', {
                    orderId: order._id,
                    runnerId: availableRunner._id
                });

                // Değişiklikleri kaydet
                await Promise.all([
                    order.save(),
                    availableRunner.save()
                ]);

                // Kurye bilgilerini populate et
                await order.populate('runner', 'name phone currentLocation');

                // Bildirim gönder
                await notificationService.notifyNewOrder(order);

                console.log('Sipariş başarıyla atandı');
                res.status(201).json({
                    ...order.toJSON(),
                    message: 'Sipariş kuryeye atandı'
                });
            } else {
                // Müsait kurye yoksa siparişi beklemede bırak
                await order.save();
                console.log('Müsait kurye bulunamadı, sipariş beklemede');
                res.status(201).json({
                    ...order.toJSON(),
                    message: 'Sipariş alındı, kurye bekleniyor'
                });
            }

        } catch (error) {
            console.error('Sipariş oluşturma hatası:', error);
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

            // Duruma göre işlemler
            switch (status) {
                case 'pickedUp':
                    order.pickedUpAt = new Date();
                    await notificationService.notifyOrderPickedUp(order);
                    break;
                case 'delivered':
                    order.deliveredAt = new Date();
                    if (order.runner) {
                        const runner = await Runner.findById(order.runner);
                        if (runner) {
                            runner.currentStatus = 'available';
                            runner.activeOrder = null;
                            await runner.save();
                        }
                    }
                    await notificationService.notifyOrderDelivered(order);
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