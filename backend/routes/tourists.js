const express = require('express')
const {removeProductFromWishlist, addProductToWishlist, getWishlistProducts, createTourist, getTourist,getTouristByEmail,updateRecords,deleteTourist,getPastItinerariesWithTourGuides,getPastItinerariesWithTourGuidesForCommentOnItenrary,addItineraryToTourist,getPastBookedActivities, bookTransportation, addFlightOfferToTourist, addHotelOfferToTourist, rateProduct ,purchaseProductbck, getPurchasedProducts, rateTourGuide, rateItinerary ,makePayment,redeemPoints,rateActivity,makePayment2} = require('../controllers/touristController')
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router()

router.get('/', getTourist)

router.post('/removeProductWishList',removeProductFromWishlist)
router.post('/getWishList',getWishlistProducts)
router.post('/addProductToWishList',addProductToWishlist)
router.patch('/:id/bookTransportation', bookTransportation);
router.post('/', createTourist)
router.post('/getByEmail' ,getTouristByEmail);
router.post('/updateByEmail',updateRecords);
router.delete('/:id', deleteTourist);
router.post('/past-itineraries', getPastItinerariesWithTourGuides);
router.post('/past-itineraries2', getPastItinerariesWithTourGuidesForCommentOnItenrary);
router.post('/test',addItineraryToTourist);
router.post('/past-activities',getPastBookedActivities)
router.put('/:userId/book-flight-offer/:offerId', addFlightOfferToTourist);
router.put('/:userId/book-hotel-offer/:offerId', addHotelOfferToTourist);
router.post('/purchase', purchaseProductbck);
router.get('/purchased', getPurchasedProducts);
router.patch('/rate/', rateProduct);
router.patch('/rate-tour-guide', rateTourGuide);
router.patch('/rate-itinerary', rateItinerary);
router.patch('/rate-activity', rateActivity);
router.post('/:id/make-payment', makePayment);
router.post('/:id/redeem-points', redeemPoints);
router.post('/:id/make-payment2', makePayment2);

module.exports = router