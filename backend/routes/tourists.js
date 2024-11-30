const express = require('express')
const {addProductToCard, removeProductFromWishlist, addProductToWishlist, getWishlistProducts, createTourist, getTourist,getTouristByEmail,updateRecords,deleteTourist,getPastItinerariesWithTourGuides,getPastItinerariesWithTourGuidesForCommentOnItenrary,addItineraryToTourist,getPastBookedActivities, bookTransportation, addFlightOfferToTourist, addHotelOfferToTourist, rateProduct ,purchaseProductbck, getPurchasedProducts, rateTourGuide, rateItinerary ,makePayment,redeemPoints,rateActivity,makePayment2,getTouristById, getItinerariesForTourist, getActivitiesForTourist, bookmarkActivity, getBookmarkedActivities, deleteAllTourists,addDeliveryAddress,getDeliveryAddresses,CreateAndReturnOrderArray,deleteOrder,viewCart,removeProductFromCart, viewOrders} = require('../controllers/touristController')
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router()

router.get('/', getTourist)
router.delete('/deleteAll', deleteAllTourists); // Move this line above the `/:id` route
router.get('/:id', getTouristById);
router.post('/addProductToCart',addProductToCard)
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
router.get('/:email/itineraries', getItinerariesForTourist);
router.get('/:email/activities', getActivitiesForTourist);
router.post('/bookmark-activity', bookmarkActivity);
router.post('/getBookmarkedActivities', getBookmarkedActivities);
router.post('/:touristId/add-delivery-address', addDeliveryAddress);
router.get('/:touristId/get-delivery-addresses', getDeliveryAddresses);
router.post('/:touristId/orders-create-view',CreateAndReturnOrderArray)
router.post('/:touristId/ordersView',viewOrders)
router.delete('/:touristId/orders/:orderId', deleteOrder);
router.get('/:touristId/cart', viewCart);
router.delete('/:touristId/cart/:productId', removeProductFromCart);
module.exports = router