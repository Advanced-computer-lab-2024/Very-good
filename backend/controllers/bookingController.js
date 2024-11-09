const Booking = require('../models/bookingModel'); // Import the Booking model
const Activity = require('../models/activityModel'); // Import the Activity model
const Itinerary = require('../models/itineraryModel'); // Import the Itinerary model
const Tourist = require('../models/touristModel'); // Import the Tourist model

const createBooking = async (req, res) => {
    const { email, activityId, itineraryId, numberOfParticipants } = req.body;
    try {
        // Find the tourist by email instead of ID
        const tourist = await Tourist.findOne({ email });
        if (!tourist) {
            return res.status(400).json({ message: 'Tourist not found' });
        }

        let booking = null;

        if (activityId) {
            const activity = await Activity.findById(activityId);
            if (!activity ) {
                return res.status(400).json({ message: 'Activity not available for booking' });
            }
            booking = new Booking({
                touristId: tourist._id, // Use tourist._id obtained by email lookup
                activityId,
                numberOfParticipants
            });

            await Tourist.findByIdAndUpdate(tourist._id, { // Use tourist._id here too
                $addToSet: { bookedActivities: activityId }
            });
        } else if (itineraryId) {
            const itinerary = await Itinerary.findById(itineraryId);
            if (!itinerary || !itinerary.isActive) {
                return res.status(400).json({ message: 'Itinerary not available for booking' });
            }
            booking = new Booking({
                touristId: tourist._id, // Use tourist._id obtained by email lookup
                itineraryId,
                numberOfParticipants
            });

            await Tourist.findByIdAndUpdate(tourist._id, { // Use tourist._id here too
                $addToSet: { bookedItineraries: itineraryId }
            });
        } else {
            return res.status(400).json({ message: 'Must provide either activityId or itineraryId' });
        }

        await booking.save();
        res.status(201).json({ message: 'Booking successful', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to get all bookings
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find(); // Fetch bookings from the database
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving bookings' });
    }
};

module.exports = {createBooking, getBookings};