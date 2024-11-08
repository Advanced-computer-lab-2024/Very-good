const express = require('express')
const {createProduct, getProducts, searchbyname,getavailableProducts , putProducts,filterProductsByPrice,deleteProductsBySeller} = require('../controllers/productController')
const router = express.Router()

router.get('/', getProducts)
router.get('/available', getavailableProducts)

//router.get('/:id', getWorkout)

router.post('/', createProduct)
router.get('/search', searchbyname)

router.patch('/:sellerId/products/:productId', putProducts);
router.get('/filter', filterProductsByPrice),
router.delete('/:sellerId/products', deleteProductsBySeller);
//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router