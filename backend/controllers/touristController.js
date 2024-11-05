const { default: mongoose } = require('mongoose')
const Tourist = require('../models/touristModel');
const Itinerary = require('../models/itineraryModel'); // Import your Itinerary model
const TourGuide = require('../models/tourGuideModel')
const Activity = require ('../models/activityModel')
const bookTransportation = async (req, res) => {
  try {
    const { id } = req.params; // Get the tourist ID from the request parameters
    const { transportationId } = req.body; // Get the transportation ID from the request body

    // Find the tourist by ID
    const tourist = await Tourist.findById(id);

    // Check if the tourist was found
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Add the transportation ID to the bookedTransportations array
    tourist.bookedTransportations.push(transportationId);
    
    // Save the updated tourist record back to the database
    await tourist.save();

    // Send a success response
    res.status(200).json({
      message: 'Transportation booked successfully',
      tourist: {
        id: tourist._id,
        bookedTransportations: tourist.bookedTransportations // Optionally return the updated array
      }
    });
  } catch (error) {
    console.error('Error booking transportation:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const addFlightOfferToTourist = async (req, res) => {
  const { userId, offerId } = req.params; // Assuming userId and offerId are passed as URL parameters

  try {
    // Find the tourist by userId
    const tourist = await Tourist.findById(userId);

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Add the offerId to the bookedFlightOffers array
    tourist.bookedFlightOffers.push(offerId);

    // Save the updated tourist document
    await tourist.save();

    return res.status(200).json({ message: 'Flight offer added successfully', bookedFlightOffers: tourist.bookedFlightOffers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const addHotelOfferToTourist = async (req, res) => {
  const { userId, offerId } = req.params; // Assuming userId and offerId are passed as URL parameters

  try {
    // Find the tourist by userId
    const tourist = await Tourist.findById(userId);

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Add the offerId to the bookedFlightOffers array
    tourist.bookedHotelOffers.push(offerId);

    // Save the updated tourist document
    await tourist.save();

    return res.status(200).json({ message: 'Hotel offer added successfully', bookedHotelOffers: tourist.bookedHotelOffers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

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

// Delete tourist by ID
const deleteTourist = async (req, res) => {
  try {
      const { id } = req.params; // Get the tourist ID from the request parameters

      // Find the tourist and delete them
      const deletedTourist = await Tourist.findByIdAndDelete(id);

      // Check if the tourist was found and deleted
      if (!deletedTourist) {
          return res.status(404).json({ message: 'Tourist not found' });
      }

      res.status(200).json({ message: 'Tourist deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting tourist', error: error.message });
  }
};
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
// comments methods 
// first we want to fetch all the tourguides a tourist completed a tour with , tour being an actual itnerary 
// to know if a tourist completed the tour or not we will assume that any booked itenaray with the date past , then it must have been attended 
// so what we need here is a method that extracts the email from the request body , seraches the database for that specific instance of the tourist 
// get all booked itneraries where their dates has passed , for each of these itneraries we want to extract their equivalent tour guide responsible for it 

const getPastItinerariesWithTourGuides = async (req, res) => {
  try {
      const { email } = req.body; // Extract email from the request body

      // Find the tourist by email
      const tourist = await Tourist.findOne({ email: email });
      
      if (!tourist) {
          return res.status(404).json({ message: 'Tourist not found' });
      }

      // Get the current date
      const currentDate = new Date();

      // Fetch itineraries based on the IDs in the bookedItineraries array
      const pastItineraries = await Itinerary.find({
          _id: { $in: tourist.bookedItineraries }, // Match itinerary IDs in the bookedItineraries array
          availableDates: { $exists: true, $ne: [] } // Ensure availableDates field exists and is not empty
      });

      // Filter past itineraries based on the last available date
      const filteredPastItineraries = pastItineraries.filter(itinerary => {
          const lastAvailableDate = new Date(Math.max(...itinerary.availableDates)); // Get the latest available date
          return lastAvailableDate < currentDate; // Check if it's in the past
      });

      // Extract tour guide emails from the filtered itineraries
      const tourGuideEmails = await Promise.all(pastItineraries.map(async (itinerary) => {
          const tourGuide = await TourGuide.findById(itinerary.tourGuideId); // Get the tour guide by ID
          return tourGuide ? tourGuide.email : null; // Return the email or null if not found
      }));

      // Filter out any null values in case a tour guide was not found
      const uniqueTourGuideEmails = [...new Set(tourGuideEmails.filter(email => email))];

      // Send the response with the tour guide emails
      res.status(200).json({
          message: 'Past tour guide emails retrieved successfully',
          data: uniqueTourGuideEmails // Send only the unique tour guide emails
      });
  } catch (error) {
      console.error('Error retrieving past itineraries:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const getPastItinerariesWithTourGuidesForCommentOnItenrary = async (req, res) => {
  try {
    const { email } = req.body; // Extract email from the request body

    // Find the tourist by email
    const tourist = await Tourist.findOne({ email: email });
    
    if (!tourist) {
        return res.status(404).json({ message: 'Tourist not found' });
    }

    // Get the current date
    const currentDate = new Date();

    // Fetch itineraries based on the IDs in the bookedItineraries array
    const pastItineraries = await Itinerary.find({
        _id: { $in: tourist.bookedItineraries }, // Match itinerary IDs in the bookedItineraries array
        availableDates: { $exists: true, $ne: [] } // Ensure availableDates field exists and is not empty
    });

    // Filter past itineraries based on the last available date
    const filteredPastItineraries = pastItineraries.filter(itinerary => {
        const lastAvailableDate = new Date(Math.max(...itinerary.availableDates)); // Get the latest available date
        return lastAvailableDate < currentDate; // Check if it's in the past
    });

    // Extract itinerary titles and tour guide names from the filtered itineraries
    const itineraryDetails = await Promise.all(filteredPastItineraries.map(async (itinerary) => {
        const tourGuide = await TourGuide.findById(itinerary.tourGuideId); // Get the tour guide by ID
        return {
            itineraryTitle: itinerary.title, // Return the title of the itinerary
            tourGuideName: tourGuide ? tourGuide.name : null // Return the tour guide's name or null if not found
        };
    }));

    // Filter out any itineraries where the tour guide was not found
    const validItineraryDetails = itineraryDetails.filter(detail => detail.tourGuideName !== null);

    // Send the response with the itinerary titles and tour guide names
    res.status(200).json({
        message: 'Past itineraries retrieved successfully',
        data: validItineraryDetails // Send only the itinerary titles and tour guide names
    });
} catch (error) {
    console.error('Error retrieving past itineraries:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
}
};


const addItineraryToTourist = async (req, res) => {
  try {
    const { email, itineraryId } = req.body; // Extract email and itineraryId from the request body

    // Find the tourist by email
    const tourist = await Tourist.findOne({ email: email });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Check if the itinerary already exists in the tourist's booked itineraries
    if (tourist.bookedItineraries.includes(itineraryId)) {
      return res.status(400).json({ message: 'Itinerary is already booked by this tourist' });
    }

    // Add the itinerary ID to the booked itineraries
    tourist.bookedItineraries.push(itineraryId);
    
    // Save the updated tourist document
    await tourist.save();

    // Send a success response
    res.status(200).json({ message: 'Itinerary added to tourist successfully', data: tourist.bookedItineraries });
  } catch (error) {
    console.error('Error adding itinerary to tourist:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
const getPastActivitiesForTourist = async (req, res) => {
  try {
    const { email } = req.body; // Extract email from the request body

    // Find the tourist by email
    const tourist = await Tourist.findOne({ email: email });
    
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Get the current date
    const currentDate = new Date();

    // Fetch activities based on the IDs in the bookedActivities array
    const pastActivities = await Activity.find({
      _id: { $in: tourist.bookedActivities }, // Match activity IDs in the bookedActivities array
      date: { $lt: currentDate } // Ensure the activity date is in the past
    });

    // Extract activity names from the filtered activities
    const activityNames = pastActivities.map(activity => activity.name);

    // Send the response with the activity names
    res.status(200).json({
      message: 'Past activities retrieved successfully',
      data: activityNames // Send only the activity names
    });
  } catch (error) {
    console.error('Error retrieving past activities:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};




module.exports = {createTourist, getTourist,getTouristByEmail, updateRecords ,deleteTourist, bookTransportation, addFlightOfferToTourist, addHotelOfferToTourist,getPastItinerariesWithTourGuides,
  getPastItinerariesWithTourGuidesForCommentOnItenrary,addItineraryToTourist,getPastActivitiesForTourist}