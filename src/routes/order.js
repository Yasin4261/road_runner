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
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customer
 *         - pickup
 *         - delivery
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
 *               type: object
 *         delivery:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *             location:
 *               type: object
 *         status:
 *           type: string
 *           enum: [pending, assigned, pickedUp, delivered, cancelled]
 *         price:
 *           type: number
 */

module.exports = router;
