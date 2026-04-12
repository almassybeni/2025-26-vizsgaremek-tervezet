const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const protect = require('../middleware/auth'); // A többi útvonalhoz hasonlóan a 'auth.js'-t használjuk
const admin = require('../middleware/admin'); // A többi útvonalhoz hasonlóan a middleware maga a függvény

router.post('/', protect, bookingController.createBooking);
router.get('/my', protect, bookingController.getUserBookings);
router.get('/:id', protect, bookingController.getBookingById);
router.put('/:id/cancel', protect, bookingController.cancelBooking);
router.get('/all', protect, admin, bookingController.getAllBookings);
router.put('/:id/status', protect, admin, bookingController.updateBookingStatus);

module.exports = router;