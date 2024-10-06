import axios from 'axios';


export const searchbyname = async (searchTerm) => {
    console.log("searchTerm :", searchTerm);
    
    // Construct params object
    const params = {};
    
    // Add only the filled parameters
    if (searchTerm) {
        params.name = searchTerm.name;
    }
    try {
        const response = await axios.get(`http://localhost:4000/api/products/search`, {
            params // Pass the constructed params object
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error.response.data); // Log the error response
        throw error; // Re-throw the error if needed
    }
};
export const getavailableProducts = async () => {
    try {
        const response = await axios.get('http://localhost:4000/api/products/available'); // Adjust the endpoint as needed
        return response.data.data; // Assuming your API responds with { data: [...] }
    } catch (error) {
        throw new Error('Error fetching available products: ' + error.message);
    }
};