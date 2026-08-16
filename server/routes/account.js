const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/accountController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', ctrl.getAccount);
router.get('/activity', ctrl.getActivity);
router.put('/', ctrl.updateAccount);
router.put('/notifications', ctrl.updateNotifications);
router.post('/addresses', ctrl.addAddress);
router.put('/addresses/:addressId/primary', ctrl.setPrimaryAddress);

module.exports = router;
