const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', auth, bookingController.createBooking);
router.get('/my', auth, bookingController.getUserBookings);
router.get('/:id', auth, bookingController.getBookingById);
router.put('/:id/cancel', auth, bookingController.cancelBooking);
router.get('/all', auth, admin, bookingController.getAllBookings);
router.put('/:id/status', auth, admin, bookingController.updateBookingStatus);

module.exports = router;