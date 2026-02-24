const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', tourController.getAllTours);
router.get('/:id', tourController.getTourById);
router.post('/', auth, admin, tourController.createTour);
router.put('/:id', auth, admin, tourController.updateTour);
router.delete('/:id', auth, admin, tourController.deleteTour);

module.exports = router;