const express = require('express')
const {createAdmin, getAdmins} = require('../controllers/adminController')
const router = express.Router()

router.get('/', getAdmins)

//router.get('/:id', getWorkout)

router.post('/', createAdmin)

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router