const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');

// Create a new Admin
const createAdmin = async (req, res) => {
    try {
        const { username, password, email } = req.body; // Destructure email from request body

        // Check if the username already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Check if the email already exists
        const existingEmail = await Admin.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            email // Include email when creating a new admin
        });

        await newAdmin.save();

        res.status(201).json({
            message: 'Admin created successfully',
            admin: {
                id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email // Optionally include email in response
            }
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Error creating Admin',
            error: error.message
        });
    }
};

module.exports = { createAdmin };
