const express = require('express');
const router = express.Router();
const runnerController = require('../controllers/runnerController');

/**
 * @swagger
 * /api/runners:
 *   get:
 *     summary: Tüm kuryeleri listele
 *     tags: [Runners]
 *     responses:
 *       200:
 *         description: Kuryeler başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Runner'
 */
router.get('/', runnerController.getAllRunners);

/**
 * @swagger
 * /api/runners:
 *   post:
 *     summary: Yeni kurye oluştur
 *     tags: [Runners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Runner'
 *     responses:
 *       201:
 *         description: Kurye başarıyla oluşturuldu
 */
router.post('/', runnerController.createRunner);

/**
 * @swagger
 * /api/runners/{id}/start-shift:
 *   post:
 *     summary: Kurye vardiyaya başlar
 *     tags: [Runners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kurye ID
 *     responses:
 *       200:
 *         description: Vardiya başarıyla başlatıldı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Runner'
 *       400:
 *         description: Kurye zaten vardiyada
 *       404:
 *         description: Kurye bulunamadı
 */
router.post('/:id/start-shift', runnerController.startShift);

/**
 * @swagger
 * /api/runners/{id}/end-shift:
 *   post:
 *     summary: Kurye vardiyadan çıkar
 *     tags: [Runners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kurye ID
 *     responses:
 *       200:
 *         description: Vardiyadan başarıyla çıkıldı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Runner'
 *       400:
 *         description: Aktif siparişi olan kurye vardiyadan çıkamaz
 *       404:
 *         description: Kurye bulunamadı
 */
router.post('/:id/end-shift', runnerController.endShift);

/**
 * @swagger
 * /api/runners/queue:
 *   get:
 *     summary: Aktif kurye kuyruğunu görüntüle
 *     tags: [Runners]
 *     responses:
 *       200:
 *         description: Kurye kuyruğu başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Runner'
 */
router.get('/queue', runnerController.getQueue);

/**
 * @swagger
 * components:
 *   schemas:
 *     Runner:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         vehicleType:
 *           type: string
 *           enum: [bicycle, motorcycle, car]
 *         currentStatus:
 *           type: string
 *           enum: [offline, available, busy, onBreak]
 *         shiftStartTime:
 *           type: string
 *           format: date-time
 *         queuePosition:
 *           type: number
 */

module.exports = router;
