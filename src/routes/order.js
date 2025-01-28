const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Tüm siparişleri listele
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Siparişler başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/', orderController.getAllOrders);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Yeni sipariş oluştur
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Sipariş başarıyla oluşturuldu
 */
router.post('/', orderController.createOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Sipariş durumunu güncelle
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [preparing, ready, pickedUp, onWay, delivered, cancelled]
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sipariş durumu güncellendi
 */
router.put('/:id/status', orderController.updateOrderStatus);

/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       required:
 *         - type
 *         - coordinates
 *       properties:
 *         type:
 *           type: string
 *           enum: [Point]
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *           minItems: 2
 *           maxItems: 2
 *           description: [longitude, latitude]
 *     Order:
 *       type: object
 *       required:
 *         - customer
 *         - pickup
 *         - delivery
 *         - price
 *       properties:
 *         customer:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             phone:
 *               type: string
 *             address:
 *               type: string
 *         pickup:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *             location:
 *               $ref: '#/components/schemas/Location'
 *         delivery:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *             location:
 *               $ref: '#/components/schemas/Location'
 *         price:
 *           type: number
 */

module.exports = router;
