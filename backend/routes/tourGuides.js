const express = require('express')
const {createTourGuide, getTourGuides,getTourGuideByEmail,deleteTourGuide} = require('../controllers/tourGuideController')
const router = express.Router()

router.get('/', getTourGuides)

//router.get('/:id', getWorkout)

router.post('/', createTourGuide)
router.post('/getByEmail',getTourGuideByEmail)
//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)
router.delete('/:id', deleteTourGuide);
module.exports = router