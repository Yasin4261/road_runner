const express = require('express');
const router = express.Router();
const runnerController = require('../controllers/RunnerController');

router.get('/', runnerController.getAllRunners);


//  Add CRUD routes


module.exports = router;