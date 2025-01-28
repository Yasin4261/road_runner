const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check if the service is running.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 */
router.get('/health', healthController.healthCheck);

module.exports = router;