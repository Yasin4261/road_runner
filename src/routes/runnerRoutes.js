const express = require('express');
const router = express.Router();
const runnerController = require('../controllers/runnerController');

router.get('/', runnerController.getAllRunners);


//  Add CRUD routes


module.exports = router;