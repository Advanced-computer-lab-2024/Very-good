const express = require('express')
const {createProduct, getProducts, filterProductsByPrice } = require('../controllers/productController')
const router = express.Router()

router.get('/', getProducts)

//router.get('/:id', getWorkout)

router.post('/', createProduct)

router.get('/filter', filterProductsByPrice)

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router