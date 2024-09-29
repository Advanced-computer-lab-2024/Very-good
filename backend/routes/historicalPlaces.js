const express = require('express')
const {createHistoricalPlace, getHistoricalPlaces, deleteHistoricalPlace, updateHistoricalPlace} = require('../controllers/historicalPlaceController')
const router = express.Router()

router.get('/', getHistoricalPlaces)

//router.get('/:id', getWorkout)

router.post('/', createHistoricalPlace)

router.delete('/:id', deleteHistoricalPlace)

router.put('/:id', updateHistoricalPlace)

//router.patch('/:id', updateWorkout)

module.exports = router