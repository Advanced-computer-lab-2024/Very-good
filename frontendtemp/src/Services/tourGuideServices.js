import axios from 'axios';

const updateAcceptedTermsAndConditions = async (tourGuideId) => {
  try {
    const response = await axios.put(
      `http://localhost:4000/api/tourguides/${tourGuideId}/accepted-terms`, // API endpoint
      {} // No request body needed
    );

    return response.data; // Return the response data to the caller
  } catch (error) {
    console.error('Error updating accepted terms and conditions:', error.response?.data || error.message);
    throw error; // Rethrow the error for further handling by the caller
  }
};
export const getItinerariesWithTourGuideId = async (id) => {
  try {
    // Use template literals to include the id in the URL path
    const response = await axios.get(`http://localhost:4000/api/tourguides/${id}/itineraries`);
    return response.data; // Returns the array of itineraries
  } catch (error) {
    console.error("Error fetching itineraries:", error.message);
    throw error;
  }
};


export default updateAcceptedTermsAndConditions;
