
const express = require('express');
const { getAllPromoCodes, getUserPromoCodes } = require('../controllers/promocodesController');

const router = express.Router();

// Route to fetch all promo codes
router.get('/', getAllPromoCodes);

// Route to fetch promo codes for a specific user
router.get('/:userId', getUserPromoCodes);

module.exports = router;