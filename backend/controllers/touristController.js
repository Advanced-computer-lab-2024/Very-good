const { default: mongoose } = require('mongoose')
const Tourist = require('../models/touristModel')


// get all workout
const createTourist = async (req, res) => {
    try {
      // Destructure the request body to get user details
      const { name, email, password, mobile, nationality, dob, job} = req.body;
  
      // Create a new user instance with the role of tourist
      const newUser = new Tourist({
        name,
        email,
        password,
        mobile,
        nationality,
        dob,
        job 
        // No need to set bookedItineraries, createdItineraries, or wallet; they will default to appropriate values
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Send success response
      res.status(200).json({
        message: 'Tourist created successfully',
        tourist: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
          nationality: newUser.nationality,
          dob: newUser.dob,
          job: newUser.job,
        }
      });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(400).json({
        message: 'Error creating tourist',
        error: error.message
      });
    }
};

const getTourist = async (req, res) => {
    try {
        const users = await Tourist.find(); // Fetch all users from the database
        res.status(200).json({
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving users',
            error: error.message
        });
    }
};

// get a single workout
const getTouristByEmail = async (req, res) => {
  try {
      // Extract email from the request body
      const { email } = req.body; // Assuming the email is sent in the request body

      // Query the database for the tourist with the given email
      const tourist = await Tourist.findOne({ email: email });

      // Check if the tourist was found
      if (!tourist) {
          return res.status(404).json({
              message: 'Tourist not found'
          });
      }

      // Return the tourist data in JSON format
      res.status(200).json({
          message: 'Tourist retrieved successfully',
          data: tourist
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: 'Error retrieving tourist',
          error: error.message
      });
  }
};


// create a workout
const createWorkout = async (req, res) => {


}

// delete a workout
const deleteWorkout = async (req, res) => {
    

}

const updateRecords = async (req, res) => {
  try {
    const { email, updatedData } = req.body; // Extract email and updated data from the request body

    // Find the tourist by email
    const tourist = await Tourist.findOne({ email: email });

    if (!tourist) {
      // If no tourist is found with the provided email, send an error response
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Update the tourist's fields with the values from updatedData
    tourist.name = updatedData.name || tourist.name;
    tourist.mobile = updatedData.mobile || tourist.mobile;
    tourist.nationality = updatedData.nationality || tourist.nationality;
    tourist.job = updatedData.job || tourist.job;
    tourist.wallet = updatedData.wallet || tourist.wallet;
    tourist.email=updatedData.email||tourist.email;
    tourist.password=updatedData.password||tourist.password;
    // Any other fields you want to update
    // We are not updating `email` or `password` for security reasons unless explicitly needed

    // Save the updated tourist record back to the database
    const updatedTourist = await tourist.save();

    // Send a success response with the updated tourist data
    res.status(200).json({
      message: 'Tourist updated successfully',
      data: updatedTourist
    });
  } catch (error) {
    console.error('Error updating tourist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {createTourist, getTourist,getTouristByEmail, updateRecords }