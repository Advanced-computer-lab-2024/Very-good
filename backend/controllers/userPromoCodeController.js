const Tourist = require('../models/touristModel');
const userPromoCode = require('../models/userPromoCodeModel');
const sendEmail = require('./emailController'); // Email utility

// Utility to generate a random promo code
function generatePromoCodeTitle() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 10; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `HAPPYBDAY-${code}`;
}

// Generate and send birthday promo code
async function generateBirthdayPromoCodes() {
    const today = new Date();
    const todayMonthDay = `${today.getMonth() + 1}-${today.getDate()}`;

    try {
        // Find tourists whose birthday is today
        const tourists = await Tourist.find();
        tourists.forEach(async (tourist) => {
            const birthdayMonthDay = `${tourist.dob.getMonth() + 1}-${tourist.dob.getDate()}`;
            if (birthdayMonthDay === todayMonthDay) {
                console.log("tourist with birthday today", tourist);
                // Create a new promo code
                const promoCodeTitle = generatePromoCodeTitle();
                const promoCode = new userPromoCode({
                    title: promoCodeTitle,
                    percentage: 20, // Example: 20% discount
                    touristId: tourist._id,
                });

                // Save promo code to the database
                await promoCode.save();

                // Add promo code ID to the tourist's promoCodes array
                tourist.promoCodes.push(promoCode._id);
                await tourist.save();

                // Send the promo code via email
                await sendEmail({
                    to: tourist.email,
                    subject: 'Happy Birthday! 🎉 Here’s Your Promo Code!',
                    text: `Hi ${tourist.name},\n\nCelebrate your birthday with a special gift! Use the promo code "${promoCode.title}" to get ${promoCode.percentage}% off on anything on our website. Enjoy your day!`,
                });

                console.log(`Promo code ${promoCode.title} sent to ${tourist.email}`);
            }
        });
    } catch (error) {
        console.error('Error generating birthday promo codes:', error);
    }
}

module.exports = {
    generateBirthdayPromoCodes,
};
