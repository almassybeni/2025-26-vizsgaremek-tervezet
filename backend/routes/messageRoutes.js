const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', messageController.sendMessage);
router.get('/inbox', protect, admin, messageController.getInbox);
router.put('/:id/read', protect, admin, messageController.markAsRead);

module.exports = router;