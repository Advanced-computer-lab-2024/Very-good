import axios from 'axios';

const updateAcceptedTermsAndConditions = async (sellerId) => {
  try {
    const response = await axios.put(
      `http://localhost:4000/api/sellers/${sellerId}/accepted-terms`, // API endpoint
      {} // No request body needed
    );

    return response.data; // Return the response data to the caller
  } catch (error) {
    console.error('Error updating accepted terms and conditions:', error.response?.data || error.message);
    throw error; // Rethrow the error for further handling by the caller
  }
};

export default updateAcceptedTermsAndConditions;
