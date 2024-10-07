const express = require('express')
const {createProduct, getProducts, searchbyname,getavailableProducts , putProducts} = require('../controllers/productController')
const router = express.Router()

router.get('/', getProducts)
router.get('/available', getavailableProducts)

//router.get('/:id', getWorkout)

router.post('/', createProduct)
router.get('/search', searchbyname)

router.patch('/:sellerId/products/:productId', putProducts);


//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router