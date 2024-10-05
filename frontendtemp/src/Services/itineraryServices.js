import axios from 'axios';

export const fetchItineraries = async (tourGuideId) => {
    const url = `http://localhost:4000/api/tourGuides/${tourGuideId}/itineraries`; 
    console.log(tourGuideId)
    const response = await axios.get(url);
    return response.data;
};
export const fetchItinerariesNoId = async () => {
    const url = `http://localhost:4000/api/itineraries`; 
    const response = await axios.get(url);
    return response.data;
};


export const deleteItinerary = async (itineraryId) => {
    const url = `http://localhost:4000/api/tourGuides/${itineraryId}/itineraries`;
    await axios.delete(url);
};

export const updateItinerary = async (itineraryId, updatedItinerary) => {
    const url = `http://localhost:4000/api/tourGuides/${itineraryId}/itineraries`;
    const response = await axios.put(url, updatedItinerary); // Assuming your backend uses PUT for updates
    return response.data;
};

export const createItinerary = async (newItinerary) => {
    console.log("will create itinerary now")
    console.log(newItinerary)
    const url = `http://localhost:4000/api/itineraries/`;
    console.log("created itinerary")
    const response = await axios.post(url, newItinerary);
    return response.data;
};