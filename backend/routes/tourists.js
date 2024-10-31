const express = require('express')
const {createTourist, getTourist,getTouristByEmail,updateRecords,deleteTourist, bookTransportation} = require('../controllers/touristController')
const router = express.Router()

router.get('/', getTourist)

//router.get('/:id', getWorkout)
router.patch('/:id/bookTransportation', bookTransportation);
router.post('/', createTourist)
router.post('/getByEmail', getTouristByEmail);
//router.delete('/:id', deleteWorkout)
router.post('/updateByEmail',updateRecords);
//router.patch('/:id', updateWorkout)
router.delete('/:id', deleteTourist);
module.exports = router