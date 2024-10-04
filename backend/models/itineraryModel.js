const mongoose = require('mongoose');

const schema = mongoose.Schema;

const itinerarySchema = new schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  activities: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    duration: {
      type: Number, // in minutes
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    location: {
      coordinates: {
        lat: Number,
        lng: Number
      },
      address: String
    },
    price: Number
  }],
  locationsToVisit: [{
    name: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    address: String
  }],
  language: {
    type: String,
    enum: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Other'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  availableDates: [{
    type: Date,
    required: true
  }],
  availableTimes: [{
    type: String, // e.g., "09:00 AM", "02:00 PM"
    required: true
  }],
  accessibility: {
    type: Boolean,
    default: false
  },
  pickUpLocation: {
    type: String,
    required: true
  },
  dropOffLocation: {
    type: String,
    required: true
  },
  touristIds: [{ // Changed to an array to hold multiple tourist references
    type: schema.Types.ObjectId,
    ref: 'tourist', // Reference to the Tourist model
    required: false
}],
tourGuideId: {
    type: schema.Types.ObjectId,
    ref: 'tourGuide', // Reference to the Tour Guide model
    required: true
}
}, { timestamps: true });

const Itinerary = mongoose.model('itinerary', itinerarySchema);

module.exports = Itinerary;
