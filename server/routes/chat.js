const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/chatController');

router.post('/', ctrl.ask);

module.exports = router;
