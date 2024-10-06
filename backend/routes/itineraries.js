const express = require('express')
const {createItinerary, getItineraries,searchforitinerary} = require('../controllers/itineraryController')
const router = express.Router()

router.get('/', getItineraries)
router.get('/search', searchforitinerary)

//router.get('/:id', getWorkout)

router.post('/', createItinerary)

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router