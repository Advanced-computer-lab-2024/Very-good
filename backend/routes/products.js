const express = require('express')
const {createProduct, getProducts , putProducts} = require('../controllers/productController')
const router = express.Router()

router.get('/', getProducts)

//router.get('/:id', getWorkout)

router.post('/', createProduct)
router.patch('/:sellerId/products/:productId', putProducts);


//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router