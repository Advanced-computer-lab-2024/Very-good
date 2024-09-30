const express = require('express')
const {createHistoricalPlace, getHistoricalPlaces} = require('../controllers/historicalPlaceController')
const router = express.Router()

router.get('/', getHistoricalPlaces)

//router.get('/:id', getWorkout)

router.post('/', createHistoricalPlace)

//router.delete('/:id', deleteWorkout)

// router.get('/', filterHistoricalPlacesByTag)


//router.patch('/:id', updateWorkout)

module.exports = router