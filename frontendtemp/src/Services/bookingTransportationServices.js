import axios from 'axios';

// Function to book transportation
const bookTransportation = async (touristId, transportationId) => {
  try {
    const response = await axios.patch(`http://localhost:4000/api/tourists/${touristId}/bookTransportation`, {
      transportationId
    });

    console.log('Transportation booked successfully:', response.data);
    return response.data; // Return the response data for further processing if needed
  } catch (error) {
    console.error('Error booking transportation:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for handling it in the calling function if needed
  }
};

export const createTransportation = async (transportationData) => {
  try {
    const response = await axios.post('http://localhost:4000/api/transportations/', transportationData);
    return response.data;
  } catch (error) {
    console.error('Error creating transportation:', error);
    throw error;
  }
};

export default bookTransportation;
