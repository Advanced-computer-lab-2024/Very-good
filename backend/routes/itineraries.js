const express = require('express')
const {createItinerary, getItineraries, filterItineraries} = require('../controllers/itineraryController')
const router = express.Router()

router.get('/', getItineraries)

//router.get('/:id', getWorkout)

router.post('/', createItinerary)

 

router.post('/filter', filterItineraries) // POST request to filter itineraries



//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router