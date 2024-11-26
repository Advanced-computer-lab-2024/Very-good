const express = require('express')
const {getTransportationsWithLocation, getAllTransportations, createTransportation, getTransportationById, getTransportationsByAdvertiserId, editTransportation, deleteTransportation} = require('../controllers/transportationController')
const router = express.Router()

router.get('/advertiser/:advertiserId', getTransportationsByAdvertiserId)
router.get('/:id', getTransportationById)
router.get('/', getAllTransportations)
router.post('/', createTransportation)
router.post('/getWithLocation', getTransportationsWithLocation)
router.put('/:id', editTransportation); // Use PUT for updates
router.delete('/:id', deleteTransportation); // Use DELETE for removal

module.exports = router