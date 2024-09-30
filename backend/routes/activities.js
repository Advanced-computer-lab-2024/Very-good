const express = require('express')
const {createActivity, getActivities, filterActivities} = require('../controllers/activityController')
const router = express.Router()

router.get('/', getActivities)

//router.get('/:id', getWorkout)

router.post('/', createActivity)

// Route to filter activities by budget, date, category, or ratings
router.post('/filter', filterActivities)

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router