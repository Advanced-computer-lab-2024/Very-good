const { default: mongoose } = require('mongoose')
const TourGuide = require('../models/tourGuideModel')


// get all workout
const createTourGuide = async (req, res) => {
    try {
      // Destructure the request body to get user details
      const { name, email, password, mobile, nationality, dob, yearsOfExperience, previousJob} = req.body;
  
      const newTourGuide = new TourGuide({
        name,
        email,
        password,
        mobile,
        nationality,
        dob,
        yearsOfExperience,
        previousJob
      });
  
      await newTourGuide.save();
  
      // Send success response
      res.status(200).json({
        message: 'Tour Guide created successfully',
        tourGuide: {
          id: newTourGuide._id,
          name: newTourGuide.name,
          email: newTourGuide.email,
          mobile: newTourGuide.mobile,
          nationality: newTourGuide.nationality,
          dob: newTourGuide.dob,
          yearsOfExperience : newTourGuide.yearsOfExperience,
          previousJob : newTourGuide.previousJob
        }
      });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(400).json({
        message: 'Error creating Tour Guide',
        error: error.message
      });
    }
};

const getTourGuides = async (req, res) => {
    try {
        const users = await TourGuide.find(); // Fetch all Tour Guides from the database
        res.status(200).json({
            message: 'Tour Guides retrieved successfully',
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Tour Guides',
            error: error.message
        });
    }
};

// a method that gets a single tour guide data based on email
const getTourGuideByEmail = async (req, res) => {
  const { email } = req.body; // Ensure the email is in the request body
  
  try {
      const tourGuide = await TourGuide.findOne({ email });

      if (!tourGuide) {
          return res.status(404).json({ message: 'Tour Guide not found' });
      }

      res.status(200).json({ tourGuide });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching Tour Guide', error: error.message });
  }
};



// create a workout
const createWorkout = async (req, res) => {


}

// delete a workout
const deleteWorkout = async (req, res) => {
    

}

const updateWorkout = async (req, res) => {

}

module.exports = {createTourGuide, getTourGuides,getTourGuideByEmail}