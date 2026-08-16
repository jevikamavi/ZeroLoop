const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pickupLocation');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/upcoming', ctrl.getUpcoming);
router.post('/extra', ctrl.requestExtraPickup);
router.get('/recurring', ctrl.getRecurringSchedule);
router.put('/recurring', ctrl.saveRecurringSchedule);

module.exports = router;
