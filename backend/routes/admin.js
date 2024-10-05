const express = require('express');
const { createAdmin } = require('../controllers/adminController');
const { createTag, getTags, updateTag, deleteTag }= require('../controllers/tagController');

const router = express.Router();



// POST new Admin
router.post('/', createAdmin);
router.get('/getadmintag', getTags); // Get all tags
router.post('/createadmintag', createTag); // Create a new tag
router.patch('/updateadmintag/:id', updateTag); // Update an existing tag by ID
router.delete('/deleteadmintag/:id', deleteTag); // Delete a tag by ID

module.exports = router;const express = require('express')
const {createAdmin, getAdmins} = require('../controllers/adminController')
const router = express.Router()

router.get('/', getAdmins)

//router.get('/:id', getWorkout)

router.post('/', createAdmin)

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router