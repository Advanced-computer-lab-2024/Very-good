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
            activities,    // Array of embedded activities
            touristIds,    // Array of tourist IDs
            tourGuideId,   // ID of the tour guide
            locationsToVisit,
            language,
            price,
            availableDates,
            availableTimes,
            accessibility,
            pickUpLocation,
            dropOffLocation
        } = req.body;

        // Create a new Itinerary object with embedded activities
        const newItinerary = new Itinerary({
            title,
            description,
            activities,    // Embedded activities
            touristIds,    // Array of tourist IDs
            tourGuideId,   // ID of the tour guide
            locationsToVisit,
            language,
            price,
            availableDates,
            availableTimes,
            accessibility,
            pickUpLocation,
            dropOffLocation
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
            itinerary: newItinerary
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

// Filter itineraries based on parameters
const filterItineraries = async (req, res) => {
    try {
        // Destructure filter parameters from the request body
        const { budget, startDate, endDate, preferences, language } = req.body;

        // Build the query object based on provided filters
        let query = {};

        if (budget) {
            query.price = { $lte: budget }; // Filter itineraries by price
        }

        if (startDate || endDate) {
            query.availableDates = {};
            if (startDate) {
                query.availableDates.$gte = new Date(startDate); // Filter by start date
            }
            if (endDate) {
                query.availableDates.$lte = new Date(endDate); // Filter by end date
            }
        }

        if (preferences && preferences.length > 0) {
            query.preferences = { $in: preferences }; // Assuming you have a 'preferences' field in your itinerary model
        }

        if (language) {
            query.language = language; // Assuming you have a 'language' field in your itinerary model
        }

        // Fetch itineraries based on the query
        const itineraries = await Itinerary.find(query);

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

module.exports = {
    createItinerary,
    getItineraries,
    filterItineraries
};
