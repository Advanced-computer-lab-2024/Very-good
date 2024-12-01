const PromoCode = require('../models/promoCodeModel');
const UserPromoCode = require('../models/userPromoCodeModel');

// Fetch all promo codes
const getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find();
        res.status(200).json(promoCodes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch promo codes', error });
    }
};

// Fetch promo codes for a specific user
const getUserPromoCodes = async (req, res) => {
    const { userId } = req.params;
    try {
        const userPromoCodes = await UserPromoCode.find({ touristId: userId });
        res.status(200).json(userPromoCodes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user promo codes', error });
    }
};

module.exports = {
    getAllPromoCodes,
    getUserPromoCodes
};