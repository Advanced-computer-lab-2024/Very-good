// RequestSendingMethods.js - contains all the methods that send requests used in the action listeners

// Function for the registration of a tourist
const registerTourist = async (touristData) => {
    try {
      const response = await fetch('http://localhost:4000/api/tourists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(touristData),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Tourist registered successfully:', data);
        return data;
      } else {
        console.error('Error during registration:', data);
        return null;
      }
    } catch (error) {
      console.error('Network or server error:', error);
      return null;
    }
  };
  
  // Function to send a request to retrieve a certain tourist record by email
  const fetchTouristByEmail = async (emailObject) => {
    try {
      const response = await fetch('http://localhost:4000/api/tourists/getByEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailObject),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Tourist data retrieved successfully:', data);
        return data;
      } else {
        console.error('Error:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Network error while fetching tourist:', error);
      return null;
    }
  };
  
  // Function to send a request for updating a tourist by email
  async function updateTouristByEmail(email, updatedData) {
    const url = 'http://localhost:4000/api/tourists/updateByEmail';
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, updatedData }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Error updating tourist');
      }
  
      const result = await response.json();
      console.log('Tourist updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Error updating tourist:', error.message);
      throw error;
    }
  }
  
  // Tour guide request methods
  
  // Function for the registration of a tour guide
  const createTourGuideRequest = async (tourGuideData) => {
    try {
      const response = await fetch('http://localhost:4000/api/tourGuides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourGuideData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create tour guide: ' + response.statusText);
      }
  
      const data = await response.json();
      console.log('registrationOK', data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
  // Function to retrieve a tour guide by email
  const fetchTourGuideByEmail = async (email) => {
    try {
      const response = await fetch('http://localhost:4000/api/tourGuides/getByEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching Tour Guide');
      }
  
      const data = await response.json();
      return data.tourGuide;
    } catch (error) {
      console.error('Error fetching tour guide:', error.message);
      throw error;
    }
  };
  
  // Function for the registration of a seller
  const registerSeller = async (sellerData) => {
    try {
      const response = await fetch('http://localhost:4000/api/sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellerData),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Seller registered successfully:', data);
        return data;
      } else {
        console.error('Error during seller registration:', data);
        return null;
      }
    } catch (error) {
      console.error('Network or server error during seller registration:', error);
      return null;
    }
  };
  
  // Export all the methods
  export { registerTourist, fetchTouristByEmail, updateTouristByEmail, createTourGuideRequest, fetchTourGuideByEmail, registerSeller };
  