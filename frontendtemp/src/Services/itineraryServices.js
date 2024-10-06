import axios from 'axios';

export const searchforitinerary = async (searchTerm) => {
    console.log("searchTerm :", searchTerm);
    
    // Construct params object
    const params = {};
    
    // Add only the filled parameters
    if (searchTerm) {
        params.title = searchTerm.title;
    }
    try {
        const response = await axios.get(`http://localhost:4000/api/itineraries/search`, {
            params // Pass the constructed params object
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching Itineraries:", error.response.data); // Log the error response
        throw error; // Re-throw the error if needed
    }
};