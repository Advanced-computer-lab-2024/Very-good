const express = require('express')
const {createItinerary, getItineraries,filterItineraries} = require('../controllers/itineraryController')
const router = express.Router()

router.get('/', getItineraries)

//router.get('/:id', getWorkout)

router.post('/', createItinerary)

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)
router.post('/filter', filterItineraries) // POST request to filter itineraries
module.exports = router