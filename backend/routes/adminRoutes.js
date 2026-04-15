const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

// A Dashboard statisztikák végpontja
router.get('/stats', protect, admin, adminController.getDashboardStats);

module.exports = router;