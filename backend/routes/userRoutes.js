const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, admin, userController.getAllUsers);
router.put('/:id', auth, userController.updateUser);
router.post('/password-reset-request', auth, admin, userController.requestPasswordChange);
router.post('/change-password', userController.changePasswordWithToken);

module.exports = router;