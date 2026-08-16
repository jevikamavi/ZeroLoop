const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/marketplaceController');

router.get('/', ctrl.getListings);
router.post('/', ctrl.createListing);

module.exports = router;
