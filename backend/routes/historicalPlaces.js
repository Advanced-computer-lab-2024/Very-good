const express = require('express')
const {createHistoricalPlace, getHistoricalPlaces, deleteHistoricalPlace, updateHistoricalPlace, getHistoricalPlaceTags, searchforHP} = require('../controllers/historicalPlaceController')
const router = express.Router()

router.get('/', getHistoricalPlaces)

router.get('/:id/tags', getHistoricalPlaceTags)

//router.get('/:id', getWorkout)

router.post('/', createHistoricalPlace)

router.delete('/:id', deleteHistoricalPlace)

router.put('/:id', updateHistoricalPlace)

router.get('/search',searchforHP)
//router.patch('/:id', updateWorkout)

module.exports = router