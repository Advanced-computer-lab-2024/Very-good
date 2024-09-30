const express = require('express')
const {createTag, getTags} = require('../controllers/tagController')
const router = express.Router()

router.get('/', getTags)

//router.get('/:id', getWorkout)

router.post('/', createTag)

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router