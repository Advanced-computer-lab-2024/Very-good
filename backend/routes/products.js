const express = require('express');
const {
    createProduct,
    getProducts,
    searchbyname,
    getavailableProducts,
    putProducts,
    filterProductsByPrice,
    archiveProduct,
    unarchiveProduct
} = require('../controllers/productController');
const router = express.Router();

router.get('/', getProducts);
router.get('/available', getavailableProducts);

// Distinct paths for archive and unarchive
router.patch('/:id/archive', archiveProduct);
router.patch('/:id/unarchive', unarchiveProduct);
router.patch('/:sellerId/products/:productId', putProducts);

router.post('/', createProduct);
router.get('/search', searchbyname);

router.patch('/:sellerId/products/:productId', putProducts);  // Update product route

// Filter products by price
router.get('/filter', filterProductsByPrice);


module.exports = router;
