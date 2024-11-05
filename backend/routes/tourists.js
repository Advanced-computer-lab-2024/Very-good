const express = require('express')
const {createTourist, getTourist,getTouristByEmail,updateRecords,deleteTourist,getPastItinerariesWithTourGuides,getPastItinerariesWithTourGuidesForCommentOnItenrary,addItineraryToTourist,getPastActivitiesForTourist} = require('../controllers/touristController')
const router = express.Router()

router.get('/', getTourist)

//router.get('/:id', getWorkout)

router.post('/', createTourist)
router.post('/getByEmail', getTouristByEmail);
//router.delete('/:id', deleteWorkout)
router.post('/updateByEmail',updateRecords);
//router.patch('/:id', updateWorkout)
router.delete('/:id', deleteTourist);
router.post('/past-itineraries', getPastItinerariesWithTourGuides);
router.post('/past-itineraries2', getPastItinerariesWithTourGuidesForCommentOnItenrary);
router.post('/test',addItineraryToTourist);
router.post('/past-activities',getPastActivitiesForTourist)
module.exports = router