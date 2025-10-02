const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');

// Subscribe endpoint
router.post('/subscribe', subscriberController.subscribe);

// Get all subscribers (admin only - you can add auth later)
router.get('/all', subscriberController.getAllSubscribers);

// Unsubscribe endpoint
router.post('/unsubscribe', subscriberController.unsubscribe);

// Export CSV
router.get('/export', subscriberController.exportCSV);

module.exports = router;