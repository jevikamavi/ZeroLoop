const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rewardController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', ctrl.getCatalog);
router.post('/redeem', ctrl.redeem);

module.exports = router;
