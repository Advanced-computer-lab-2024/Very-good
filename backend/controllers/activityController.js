const { default: mongoose } = require('mongoose')
const Activity = require('../models/activityModel')
const tourGuide = require('../models/tourGuideModel')
const advertiser = require('../models/advertiserModel')
const activity = require('../models/activityModel');
const Category = require('../models/categoryModel')
const Tourist = require('../models/touristModel'); // Import the Tourist model

// get all workout


const getActivityById = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameters
        const activity = await Activity.findById(id); // Find the activity by ID

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' }); // Handle case where activity is not found
        }

        // Send success response with the activity data
        res.status(200).json({
            message: 'Activity retrieved successfully',
            data: activity
        });
    } catch (error) {
        console.error('Error retrieving activity:', error);
        res.status(500).json({
            message: 'Error retrieving activity',
            error: error.message
        });
    }
};

const addCommentToActivity = async (req, res) => {
    try {
        const { activityId, touristId, comment } = req.body;

        // Find the itinerary by ID
        const activity = await Activity.findById(activityId);
        
        if (!activity) {
            return res.status(404).json({ message: 'activity not found' });
        }

        // Add the comment and tourist ID to the comments array
        activity.commentsArray.push({ comment, touristId });

        // Save the updated itinerary
        await activity.save();

        res.status(200).json({
            message: 'Comment added successfully',
            activity
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({
            message: 'Error adding comment',
            error: error.message
        });
    }
};


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
            bookingOpen : true
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
                specialDiscount: newActivity.specialDiscount,
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
const searchactivity = async(req,res) => {


    const {name,category, tag } = req.query;
        let activities = [];
    
        try {
            const query = {};
            
            if (name) {
                query.name = name; // Match the activity name
            }
            if (tag) {
                query['tags.name'] = tag; // Match the activity tags
            }
            if (category) {
                const catObject = await Category.findOne({ name: category }); // Find tag by name
                if (catObject) {
                    query.categoryId = catObject._id; // Query by the ObjectId of the tag
                } else {
                    return res.status(404).json({ error: 'Category not found.' });
                }
            }
            if (!name && !tag && !category)   {
                return res.status(400).json({ error: 'Search terms are required.' });
            }

            console.log(query)
    
            activities = await Activity.find(query); 
            
    
    
            res.status(200).json(activities);
    
        }
        
        catch(error){
            res.status(400).json({error :error.message})
    
        }
    }

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

const filterActivitiesyassin = async (req, res) => {
    try {
        const { price, date, category, ratings } = req.body; // Include language in destructuring

        // Array to hold our filtering conditions
        const filterConditions = [];

        // If price is provided and not null, add it to the conditions
        if (price !== null && price !== undefined) {
            filterConditions.push({ price: { $eq: price } }); // Exact match for price
        }

        // If date is provided and not null, add it to the conditions
        if (date) {
            const inputDate = new Date(date); // Ensure input date is a Date object
            if (!isNaN(inputDate)) { // Check if date is valid
                filterConditions.push({ date: { $eq: inputDate } });
            } else {
                console.error('Invalid date format provided:', date);
                return res.status(400).json({ error: 'Invalid date format' });
            }
        }

        if (ratings !== undefined && ratings !== null) {
            filterConditions.push({ ratings:  ratings  }); // Filter activities with ratings greater than or equal to provided rating
        }
        if (category !== undefined && category !== null) {
            // Find categoryId corresponding to category name
            const foundCategory = await Category.findOne({ name: category });
            if (foundCategory) {
                filterConditions.push({ categoryId: foundCategory._id }); // Use categoryId for filtering
            } else {
                return res.status(200).json([]);
            }
        }

        // Check if we have any filter conditions, if not return all activities
        let query = {};
        if (filterConditions.length > 0) {
            query = { $and: filterConditions }; // Use $and for all conditions to match all
        }

        // Perform the filtering query
        const activities = await Activity.find(query);
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error filtering activities:', error.message); // Log the specific error message
        res.status(500).json({ error: 'Error filtering activities' });
    }
};

const addInterestedTourist = async (req, res) => {
    try {
        const { activityId, email } = req.body;

        // Find the tourist by email
        const tourist = await Tourist.findOne({ email });

        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Find the activity by ID
        const activity = await Activity.findById(activityId);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Add the tourist ID to the interestedTourists array if not already added
        if (!activity.interestedTourists.some(t => t.touristId.equals(tourist._id))) {
            activity.interestedTourists.push({ touristId: tourist._id, notified: false });
            await activity.save();
        }

        res.status(200).json({
            message: 'Tourist added to interested list successfully',
            activity
        });
    } catch (error) {
        console.error('Error adding interested tourist:', error);
        res.status(500).json({
            message: 'Error adding interested tourist',
            error: error.message
        });
    }
};

 
  

module.exports = {createActivity, getActivities,filterActivities,filterActivitiesyassin,searchactivity, getActivityById, addCommentToActivity, addInterestedTourist}