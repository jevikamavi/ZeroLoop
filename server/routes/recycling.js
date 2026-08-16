const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/recyclingController');

router.get('/', ctrl.search);

module.exports = router;
