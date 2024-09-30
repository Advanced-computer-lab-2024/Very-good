const express = require('express')
const {createActivity, getActivities,deleteActivity,updateActivity} = require('../controllers/activityController')
const { updateMany } = require('../models/tagModel')
const router = express.Router()

router.get('/', getActivities)

//router.get('/:id', getWorkout)

router.post('/', createActivity)

router.delete('/:id', deleteActivity)

router.patch('/:id', updateActivity)

module.exports = router