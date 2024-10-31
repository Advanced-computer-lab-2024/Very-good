const express = require('express')
const {getAllTransportations, createTransportation, getTransportationById} = require('../controllers/transportationController')
const router = express.Router()

router.get('/', getAllTransportations)
router.post('/', createTransportation)
router.get('/:id', getTransportationById)

module.exports = router