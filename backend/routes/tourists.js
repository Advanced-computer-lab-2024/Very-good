const express = require('express')
const {createTourist, getTourist,getTouristByEmail,updateRecords,deleteTourist, bookTransportation, addFlightOfferToTourist} = require('../controllers/touristController')
const router = express.Router()

router.get('/', getTourist)

router.patch('/:id/bookTransportation', bookTransportation);
router.post('/', createTourist)
router.post('/getByEmail', getTouristByEmail);
router.post('/updateByEmail',updateRecords);
router.delete('/:id', deleteTourist);
router.put('/:userId/book-flight-offer/:offerId', addFlightOfferToTourist);
module.exports = router