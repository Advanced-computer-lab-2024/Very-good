const mongoose = require('mongoose');

const userPromoCodeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true, // Promo codes should be unique
        trim: true
    },
    percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100 // Restrict the value between 0 and 100
    },
    touristId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tourist'        
    },
    used: {
        type: Boolean,
        default: false, // Indicates whether the promo code has been used
    },
}, { timestamps: true }); // Enable timestamps

module.exports = mongoose.model('userPromoCode', userPromoCodeSchema);
