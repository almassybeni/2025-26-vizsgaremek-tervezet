const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

console.log('✅ tourRoutes betöltve');
console.log('tourController metódusok:', Object.keys(tourController));

// Publikus végpontok
router.get('/', tourController.getAllTours);
router.get('/:id', tourController.getTourById);
router.get('/slug/:slug', tourController.getTourBySlug); // Új végpont slug alapján

// Admin végpontok
router.post('/', auth, admin, tourController.createTour);
router.put('/:id', auth, admin, tourController.updateTour);
router.delete('/:id', auth, admin, tourController.deleteTour);

module.exports = router;