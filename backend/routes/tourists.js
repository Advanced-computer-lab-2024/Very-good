const express = require('express')
const {createTourist, getTourist,getTouristByEmail,updateRecords,deleteTourist,getPastItinerariesWithTourGuides,getPastItinerariesWithTourGuidesForCommentOnItenrary,addItineraryToTourist,getPastActivitiesForTourist, bookTransportation, addFlightOfferToTourist, addHotelOfferToTourist, rateProduct ,purchaseProductbck, getPurchasedProducts, rateTourGuide, rateItinerary } = require('../controllers/touristController')
const router = express.Router()

router.get('/', getTourist)

router.patch('/:id/bookTransportation', bookTransportation);
router.post('/', createTourist)
router.post('/getByEmail', getTouristByEmail);
router.post('/updateByEmail',updateRecords);
router.delete('/:id', deleteTourist);
router.post('/past-itineraries', getPastItinerariesWithTourGuides);
router.post('/past-itineraries2', getPastItinerariesWithTourGuidesForCommentOnItenrary);
router.post('/test',addItineraryToTourist);
router.post('/past-activities',getPastActivitiesForTourist)
router.put('/:userId/book-flight-offer/:offerId', addFlightOfferToTourist);
router.put('/:userId/book-hotel-offer/:offerId', addHotelOfferToTourist);
router.post('/purchase', purchaseProductbck);
router.get('/purchased', getPurchasedProducts);
router.patch('/rate/:productId', rateProduct);
router.patch('/rate-tour-guide', rateTourGuide);
router.patch('/rate-itinerary', rateItinerary);


module.exports = router