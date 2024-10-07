const { default: mongoose } = require('mongoose');
const Itinerary = require('../models/itineraryModel'); // Ensure this is the correct path for the Itinerary model
const TourGuide = require('../models/tourGuideModel'); // Ensure this is the correct path for the TourGuide model

// Create an Itinerary
const createItinerary = async (req, res) => {
    try {
        // Destructure the request body to get itinerary details
        const {
            title,
            description,
            activities,
            touristIds,
            tourGuideId,
            startDate,
            endDate,
            totalPrice,
        } = req.body;

        const newItinerary = new Itinerary({
            title,
            description,
            activities,    // Array of activity IDs
            touristIds,    // Array of tourist IDs
            tourGuideId,   // ID of the tour guide
            startDate,
            endDate,
            totalPrice
        });

        // Save the new itinerary to the database
        await newItinerary.save();

        // Update the tour guide's createdItineraries array
        await TourGuide.findByIdAndUpdate(tourGuideId, {
            $push: { createdItineraries: newItinerary._id }
        });

        // Send success response
        res.status(200).json({
            message: 'Itinerary created successfully',
            itinerary: {
                id: newItinerary._id,
                title: newItinerary.title,
                description: newItinerary.description,
                activities: newItinerary.activities,
                touristIds: newItinerary.touristIds,
                tourGuideId: newItinerary.tourGuideId,
                startDate: newItinerary.startDate,
                endDate: newItinerary.endDate,
                totalPrice: newItinerary.totalPrice
            }
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(400).json({
            message: 'Error creating Itinerary',
            error: error.message
        });
    }
};

// Get all Itineraries
const getItineraries = async (req, res) => {
    try {
        const itineraries = await Itinerary.find()
            .populate('tourGuideId') // Populate the tour guide details
            .populate('activities')  // Populate activities
            .populate('touristIds'); // Populate tourists

        res.status(200).json({
            message: 'Itineraries retrieved successfully',
            data: itineraries
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Itineraries',
            error: error.message
        });
    }
};

//const Itinerary = require('../models/itineraryModel'); // Ensure to import your itinerary model   (((already present))) 


//module.exports = { filterItineraries };




// Placeholder for other functionalities like delete, update, etc.
const createWorkout = async (req, res) => {
    // Implement if needed
};

const deleteWorkout = async (req, res) => {
    // Implement if needed
};

const updateWorkout = async (req, res) => {
    // Implement if needed
};
//const Itinerary = require('../models/itineraryModel'); // Ensure to import your itinerary model   (((already present))) 

const filterItineraries = async (req, res) => {
    try {
        // Destructure filter parameters from the request body
        const { budget, date, preferences, language } = req.body;

        // Build the query object based on provided filters
        let query = {}; // No requirement for touristId

        if (budget) {
            query.price = { $lte: budget }; // Filter itineraries by budget
        }

        if (date) {
                  const exactDate = new Date(date);
                  // Set the time to the start of the day (00:00:00) and end of the day (23:59:59)
                  filter.date = {
                    $gte: new Date(exactDate.setHours(0, 0, 0, 0)), // Start of the day
                    $lte: new Date(exactDate.setHours(23, 59, 59, 999)) // End of the day
                  };
                }

        if (preferences && preferences.length > 0) {
            query.preferences = { $in: preferences }; // Assuming you have a 'preferences' field in your itinerary model
        }

        if (language) {
            query.language = language; // Assuming you have a 'language' field in your itinerary model
        }

        // Fetch itineraries based on the query
        const itineraries = await Itinerary.find(query).populate('activities'); // Populate activities if needed

        // Send the filtered itineraries back as a response
        res.status(200).json({
            message: 'Filtered itineraries retrieved successfully',
            data: itineraries
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving itineraries',
            error: error.message
        });
    }
};


//module.exports = { filterItineraries };

module.exports = {
    createItinerary,
    getItineraries,
    filterItineraries
};
