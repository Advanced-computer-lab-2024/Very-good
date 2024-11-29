// TouristService.js

import axios from 'axios';

const API_URL = 'http://localhost:4000/api/tourists';

// Directly exporting the functions
// TouristService.js
export const getTouristByEmail = async (email) => {
    try {
        const response = await axios.post(`http://localhost:4000/api/tourists/getByEmail`, {
            email : email  // Pass email as query parameter

            
        });
        console.log("trial",email)
        return response.data;
    } catch (error) {
        console.error("Error fetching tourist by email:" ,email, error);
        throw new Error("Failed to fetch tourist data");  // Re-throw the error
    }
};
export const getTouristsByIds = async (ids) => {
  try {
    // Send GET request to the backend with the tourist id as a route parameter
    const response = await axios.get(`http://localhost:4000/api/tourists`, { params: { ids } });
    // Handle successful response
    console.log("Tourist data retrieved:", response.data);
    return response.data;
  } catch (error) {
    // Handle error
    console.error("Error fetching tourist data:", error.response ? error.response.data : error.message);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

export const addProductToCart = async (touristId, productId) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/tourists/addProductToCart`, {
        touristId,
        productId,
      });
      return response.data; // Return the response data to the caller
    } catch (error) {
      console.error("Error adding product to cart:", error);
      throw error.response?.data?.message || "Failed to add product to cart.";
    }
  };

export const removeProductFromWishlist = async (touristId, productId) => {
    try {
        const response = await axios.post("http://localhost:4000/api/tourists/removeProductWishList", {
            touristId,
            productId,
        });
        return response.data;
    } catch (error) {
        console.error("Error removing product from wishlist:", error);
        throw error;
    }
};

export const addProductToWishlist = async (touristId, productId) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/tourists/addProductToWishList`, {
        touristId,
        productId,
      });
      return response.data; // Return the response data to the caller
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      throw error.response?.data?.message || "Failed to add product to wishlist.";
    }
  };


export const deleteTourist = async (userId) => {
    try {
        const response = await axios.delete(`http://localhost:4000/api/tourists/${userId}`);
        console.log("true")
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchWishlistProducts = async (touristId) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/tourists/getWishList`, {touristId});
      return response.data.products; // Return the fetched products
    } catch (error) {
      console.error("Error fetching wishlist products:", error.response?.data || error.message);
      throw error; // Re-throw the error for the caller to handle
    }
  };
 export const addDeliveryAddress = async (touristId, addressData) => {
    try {
      const response = await fetch(`http://localhost:4000/api/tourists/${touristId}/add-delivery-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add address');
      }
  
      return response.json();  // Return the response data from the server
    } catch (error) {
      console.error('Error adding delivery address:', error);
      throw error;
    }
  };
  
  export const fetchDeliveryAddresses = async (touristId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/tourists/${touristId}/get-delivery-addresses`
      );
  
      if (response.data.addresses) {
        return response.data.addresses;  // Return the fetched addresses
      } else {
        return [];  // Return an empty array if no addresses are found
      }
    } catch (error) {
      console.error('Error fetching delivery addresses:', error);
      throw new Error('Failed to fetch delivery addresses');  // Throw an error to be handled by the caller
    }
  };
  
  