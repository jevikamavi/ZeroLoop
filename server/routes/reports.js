const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', ctrl.getReports);
router.post('/', ctrl.createReport);

module.exports = router;
