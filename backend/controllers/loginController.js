// Import the necessary models
const Tourist = require('../models/touristModel');
const TourGuide = require('../models/tourGuideModel');
const Admin = require('../models/adminModel');
const TourismGovernor = require('../models/tourismGovernerModel');
const Seller = require('../models/sellerModel');
const Advertiser = require('../models/advertiserModel');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const notificationController = require('./notificationController');
// Add more models as needed for other roles (e.g., Seller, Advertiser)

// Define valid roles
const validRoles = ['admin', 'tourist', 'tourGuide', 'tourismGovernor', 'seller', 'advertiser'];

// Function to handle user login
const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    // Validate role
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role provided.' });
    }

    try {
        // Authenticate user
        const user = await authenticateUser(email, password, role);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate a JWT token (use the user ID as payload)
        const token = jwt.sign(
            { id: user._id, role: role }, // Payload: user ID and role
            process.env.JWT_SECRET, // Secret key from environment variable (use a strong secret)
            { expiresIn: '1d' } // Expiration time of 1 day
        );

        // Return success response with the user object and token
        res.status(200).json({
            message: 'Login successful',
            user, // Send the full user object
            token, // Include token in the response
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Function to authenticate user against the correct database collection
const authenticateUser = async (email, password, role) => {
    let user;
    role = role.trim();

    // Dynamically search in the appropriate collection based on the role
    switch (role) {
        case 'tourist':
            user = await Tourist.findOne({ email });
            if (user && user.email && user.dob) {
                // Check if today is the user's birthday
                const today = new Date();
                const dob = new Date(user.dob);
                if (today.getDate() === dob.getDate() && today.getMonth() === dob.getMonth()) {
                    notificationController.createNotification({
                        targetId: user._id,
                        targetType: 'Tourist',
                        subject: 'Happy Birthday!',
                        message: `Happy birthday, ${user.name}! 🎉🎂\n
                        We wish you a fantastic day and a wonderful year ahead.`
                    });

                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS,
                        },
                    });

                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: user.email,
                        subject: "Happy Birthday!",
                        text: `Happy birthday, ${user.name}! 🎉🎂\n
                        We wish you a fantastic day and a wonderful year ahead.`,
                    };

                }
            }
            break;
        case 'tourGuide':
            console.log("role :", role)
            user = await TourGuide.findOne({ email });
            break;
        case 'admin':
            user = await Admin.findOne({ email });
            break;
        case 'tourismGovernor':
            user = await TourismGovernor.findOne({ email });
            break;
        case 'seller':
            user = await Seller.findOne({ email });
            break;
        case 'advertiser':
            user = await Advertiser.findOne({ email });
            break;
        default:
            console.log("role :", role)
            console.log("Invalid role provided.");
            return null;
    }

    // Check if user exists
    if (!user) {
        console.log("No user found with this email and role.");
        return null;
    }

    // Check if the password matches (since you're not using bcrypt)
    if (user.password !== password) {
        console.log("Password mismatch.");
        return null;
    }

    // Return the authenticated user
    return user;
};

const models = {
    admin: Admin,
    tourist: Tourist,
    tourGuide: TourGuide,
    tourismGovernor: TourismGovernor,
    seller: Seller,
    advertiser: Advertiser,
};

const forgotPasswordHandler = async (req, res) => {
    const { email, role } = req.body;

    // Validate the role
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role provided." });
    }

    try {
        // Dynamically access the correct model
        const Model = models[role];
        const user = await Model.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

        // Update user with OTP and mark it as valid
        user.OTP = otp;
        user.isOTPValid = true;
        await user.save();

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for resetting your password is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "OTP sent to your email." });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const verifyOTPHandler = async (req, res) => {
    const { email, role, otp } = req.body;
    // Validate the role
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role provided." });
    }

    try {
        const Model = models[role];
        const user = await Model.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.OTP !== otp || !user.isOTPValid) {
            console.log("otp : ", otp)
            console.log("user otp in db : ", user.OTP)
            console.log("otp valid : ", user.isOTPValid)
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        // OTP is valid, invalidate it after verification
        user.isOTPValid = false;
        await user.save();

        res.status(200).json({ message: "OTP verified successfully." });
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const resetPasswordHandler = async (req, res) => {
    const { email, role, newPassword } = req.body;

    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role provided." });
    }

    try {
        const Model = models[role]; // Dynamically get the model based on the role
        const user = await Model.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Update the password directly (no hashing)
        user.password = newPassword;
        user.OTP = null; // Clear OTP
        user.isOTPValid = false; // Ensure OTP is invalid
        await user.save();

        res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};



module.exports = { loginUser, forgotPasswordHandler, verifyOTPHandler, resetPasswordHandler };
