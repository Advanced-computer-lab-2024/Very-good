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
          // Handle success here
          return data; // You can return data for further processing if needed
      } else {
          console.error('Error during registration:', data);
          // Handle error response here
          return null; // Return null in case of error
      }
  } catch (error) {
      console.error('Network or server error:', error);
      // Handle network errors
      return null; // Return null to signify an error occurred
  }
};

// Function to send a request to retrieve a certain tourist record by email
const fetchTouristByEmail = async (emailObject) => {
  try {
      const response = await fetch('http://localhost:4000/api/tourists/getByEmail', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailObject) // Send email object in request body
      });

      const data = await response.json();

      // Handle the response
      if (response.ok) {
          console.log('Tourist data retrieved successfully:', data);
          return data; // Return the retrieved data for further processing
      } else {
          console.error('Error:', data.message); // Log any error message returned from the server
          return null; // Return null in case of error
      }
  } catch (error) {
      console.error('Network error while fetching tourist:', error); // Handle network errors
      return null; // Return null in case of a network error
  }
};
// we want a function that sends a request for updating , we send the jason format with all the data and the email of the tourist 
async function updateTouristByEmail(email, updatedData) {
    const url = 'http://localhost:4000/api/tourists/updateByEmail'; // Backend endpoint

    try {
        const response = await fetch(url, {
            method: 'POST', // Specify the request method
            headers: {
                'Content-Type': 'application/json' // Set content type to JSON
            },
            body: JSON.stringify({ email, updatedData }) // Convert email and updated data to JSON
        });

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            const errorResponse = await response.json(); // Get error response
            throw new Error(errorResponse.message || 'Error updating tourist');
        }

        const result = await response.json(); // Parse the JSON response
        console.log('Tourist updated successfully:', result); // Log the result
        return result; // Return the result to caller

    } catch (error) {
        console.error('Error updating tourist:', error.message); // Log any errors
        throw error; // Rethrow the error for further handling
    }
}

//------------------------------------
// tour guide request methods 
// a method that handles the registration of the tour guide
const createTourGuideRequest = async (tourGuideData) => {
    try {
        const response = await fetch('http://localhost:4000/api/tourGuides', { // Update the endpoint accordingly
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
        console.log('registrationOK',data);
        return data; // return the response data (success message and tour guide info)
    } catch (error) {
        console.error('Error:', error);
        throw error; // propagate the error to be handled where this function is called
    }
};



// a method that handles reading the info of the tour guide by email 

// Function to send a request to retrieve a tour guide record by email
const fetchTourGuideByEmail = async (email) => {
    try {
        const response = await fetch('http://localhost:4000/api/tourGuides/getByEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }), // Ensure you're sending the email correctly
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error fetching Tour Guide');
        }

        const data = await response.json();
        return data.tourGuide; // Assuming your backend returns a tourGuide object
    } catch (error) {
        console.error('Error fetching tour guide:', error.message);
        throw error; // Propagate error for further handling
    }
};

// Export the new method along with others
export { registerTourist, fetchTouristByEmail, updateTouristByEmail, createTourGuideRequest, fetchTourGuideByEmail };
