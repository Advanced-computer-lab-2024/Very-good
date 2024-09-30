const express = require('express')
const {createCategory, getCategories,deleteCategory,updateCategory} = require('../controllers/categoryController')
const { updateMany } = require('../models/tagModel')
const router = express.Router()

router.get('/', getCategories)

router.post('/', createCategory)

router.delete('/:id', deleteCategory)

router.patch('/:id', updateCategory)

module.exports = router