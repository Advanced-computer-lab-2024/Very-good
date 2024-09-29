const { default: mongoose } = require('mongoose')
const HistoricalPlace = require('../models/historicalPlaceModel');

// Create a new Historical Place
const createHistoricalPlace = async (req, res) => {
    try {
        // Destructure the request body to get historical place details
        const { name, description, pictures, location, openingHours, ticketPrices, museum, tourismGovernerId } = req.body;

        const newHistoricalPlace = new HistoricalPlace({
            name,
            description,
            pictures,
            location,
            openingHours,
            ticketPrices,
            museum,
            tourismGovernerId
        });

        await newHistoricalPlace.save();

        // Send success response
        res.status(200).json({
            message: 'Historical Place created successfully',
            historicalPlace: {
                id: newHistoricalPlace._id,
                name: newHistoricalPlace.name,
                description: newHistoricalPlace.description,
                pictures: newHistoricalPlace.pictures,
                location: newHistoricalPlace.location,
                openingHours: newHistoricalPlace.openingHours,
                ticketPrices: newHistoricalPlace.ticketPrices,
                museum: newHistoricalPlace.museum,
                tourismGovernerId: newHistoricalPlace.tourismGovernerId
            }
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(400).json({
            message: 'Error creating Historical Place',
            error: error.message
        });
    }
};

// Get all Historical Places
const getHistoricalPlaces = async (req, res) => {
    try {
        const historicalPlaces = await HistoricalPlace.find();
        res.status(200).json({ // Fetch all Historical Places from the database
            message: 'Historical Places retrieved successfully',
            data: historicalPlaces
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Historical Places',
            error: error.message
        });
    }
};

const deleteHistoricalPlace = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the request parameters

        // Find the historical place by ID and delete it
        const deletedPlace = await HistoricalPlace.findByIdAndDelete(id);

        if (!deletedPlace) {
            return res.status(404).json({
                message: 'Historical Place not found'
            });
        }

        res.status(200).json({
            message: 'Historical Place deleted successfully',
            data: deletedPlace
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting Historical Place',
            error: error.message
        });
    }
};

const updateHistoricalPlace = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the request parameters
        const updatedData = req.body; // Get the updated data from the request body

        // Find the historical place by ID and update it
        const updatedPlace = await HistoricalPlace.findByIdAndUpdate(id, updatedData, {
            new: true, // Return the updated document
            runValidators: true // Run schema validation
        });

        if (!updatedPlace) {
            return res.status(404).json({
                message: 'Historical Place not found'
            });
        }

        res.status(200).json({
            message: 'Historical Place updated successfully',
            data: updatedPlace
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error updating Historical Place',
            error: error.message
        });
    }
};

updateHistoricalPlace

// Placeholder functions
const getWorkout = async (req, res) => {
    // Function implementation here
};

const createWorkout = async (req, res) => {
    // Function implementation here
};

const deleteWorkout = async (req, res) => {
    // Function implementation here
};

const updateWorkout = async (req, res) => {
    // Function implementation here
};

module.exports = { createHistoricalPlace, getHistoricalPlaces, deleteHistoricalPlace, updateHistoricalPlace};
