const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/', auth, messageController.sendMessage);
router.get('/inbox', auth, messageController.getInbox);
router.get('/outbox', auth, messageController.getOutbox);
router.put('/:id/read', auth, messageController.markAsRead);

module.exports = router;