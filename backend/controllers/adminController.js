const Admin = require('../models/adminModel');
const { default: mongoose } = require('mongoose')


const checkAdmin = async (req, res) => {

}

const createAdmin = async (req, res) => {
    try {
      // Destructure the request body to get user details
      const { name, email, password, mobile} = req.body;
  
      // Create a new user instance with the role of tourist
      const admin = new Admin({
        name,
        email,
        password,
        mobile
        // No need to set bookedItineraries, createdItineraries, or wallet; they will default to appropriate values
      });
  
      // Save the user to the database
      await admin.save();
  
      // Send success response
      res.status(200).json({
        message: 'Admin created successfully',
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          mobile: admin.mobile
        }
      });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(400).json({
        message: 'Error creating admin',
        error: error.message
      });
    }
};


const getAdmins = async (req, res) => {
    
}

module.exports = {checkAdmin, createAdmin,  getAdmins };