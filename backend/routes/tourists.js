const express = require('express');
const {
  createTourist,
  getTourist,
  getTouristByEmail,
  updateRecords
} = require('../controllers/touristController');
const router = express.Router();

// Route to get all tourists
router.get('/', getTourist);

// Route to create a new tourist
router.post('/', createTourist);

// Route to get tourist by email
router.post('/getByEmail', getTouristByEmail);

// Route to update tourist records by email
router.post('/updateByEmail', updateRecords);

// Uncomment these routes when their controller methods are implemented
// router.delete('/:id', deleteWorkout);
// router.patch('/:id', updateWorkout);

module.exports = router;
