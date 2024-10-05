const { default: mongoose } = require('mongoose')
const Activity = require('../models/activityModel')
const tourGuide = require('../models/tourGuideModel')
const advertiser = require('../models/advertiserModel')
const activity = require('../models/activityModel');

// get all workout
const createActivity = async (req, res) => {
    try {
        // Destructure the request body to get activity details
        const { name, date, duration, location, price, time, categoryId, ratings, tags, tourGuideId, advertiserId, specialDiscount, bookingOpen} = req.body;

        const newActivity = new Activity({
            name,
            date,
            duration,
            location,
            price,
            time,
            categoryId,
            ratings,
            tags,
            tourGuideId,
            advertiserId,
            specialDiscount,
            bookingOpen
        });

        await newActivity.save();

        if (tourGuideId) {
            await tourGuide.findByIdAndUpdate(tourGuideId, {
                $push: { createdActivities: newActivity._id } // Add the activity ID to the tour guide's created activities
            });
        }
        else if (advertiserId) {
            await advertiser.findByIdAndUpdate(advertiserId, {
                $push: { createdActivities: newActivity._id } // Add the activity ID to the advertiser's created activities
            });
        }


        // Send success response
        res.status(200).json({
            message: 'Activity created successfully',
            activity: {
                id: newActivity._id,
                name: newActivity.name,
                date: newActivity.date,
                duration: newActivity.duration,
                location: newActivity.location,
                price: newActivity.price,
                time: newActivity.time,
                categoryId: newActivity.categoryId,
                ratings: newActivity.ratings,
                tags: newActivity.tags,
                tourGuideId: newActivity.tourGuideId,
                advertiserId: newActivity.advertiserId,
                bookingOpen: newActivity.bookingOpen,
                specialDiscount: newActivity.specialDiscount
            }
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(400).json({
            message: 'Error creating Activity',
            error: error.message
        });
    }
};

const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find(); // Fetch all Activities from the database
        res.status(200).json({
            message: 'Activities retrieved successfully',
            data: activities
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Activities',
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

const updateWorkout = async (req, res) => {

}
// Import Activity model
//const Activity = require('../models/activityModel');    ((already present))

// Controller for filtering activities based on budget, date, category, or ratings
const filterActivities = async (req, res) => {
    try {
      // Extract query parameters from the request
      const { budget, startDate, endDate, category, minRating } = req.query;
  
      // Build a filter object dynamically
      let filter = {};
  
      // Apply filters based on query parameters
      if (budget) {
        filter.price = { $lte: budget }; // Less than or equal to the specified budget
      }
  
      if (startDate && endDate) {
        filter.date = {
          $gte: new Date(startDate), // Greater than or equal to the start date
          $lte: new Date(endDate) // Less than or equal to the end date
        };
      } else if (startDate) {
        filter.date = { $gte: new Date(startDate) }; // Only apply start date if no end date is provided
      }
  
      if (category) {
        filter.category = category; // Match the category exactly
      }
  
      if (minRating) {
        filter.ratings = { $gte: minRating }; // Minimum rating
      }
  
      // Find activities that match the filter
      const filteredActivities = await Activity.find(filter);
  
      // Send response with the filtered activities
      res.status(200).json({
        message: 'Filtered activities retrieved successfully',
        data: filteredActivities
      });
    } catch (error) {
      console.error('Error filtering activities:', error);
      res.status(500).json({
        message: 'Error filtering activities',
        error: error.message
      });
    }
  };
 
  

module.exports = {createActivity, getActivities,filterActivities}