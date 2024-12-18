// RequestSendingMethods.js - contains all the methods that send requests used in the action listeners

import axios from "axios";


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
      console.error('Error updating tourism:', error.message);
      throw error;
    }
  }
  async function updateTouristByEmailT(email, updatedData) {
    const url = 'http://localhost:4000/api/tourismGoverners/updateByEmailTourism'; // Fixed the URL typo

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Corrected header
            },
            body: JSON.stringify({ email, updatedData }), // Pass email and updated data
        });

        if (!response.ok) {
            // Check for non-JSON error responses (like HTML error pages)
            const text = await response.text(); // Get raw text response
            throw new Error(text || 'Error updating tourist');
        }

        const result = await response.json();
        console.log('Tourist updated successfully:', result);
        return result;
    } catch (error) {
        console.error('Error updating tourism:', error.message);
        throw error; // Rethrow the error for further handling if needed
    }
}

  

  const fetchPastbookedbytouristItineraries = async (email) => {
    try {
      const response = await axios.post('http://localhost:4000/api/tourists/past-itineraries', {
          email: email // Make sure this is a string
      });
      return response.data; // Handle the response as needed
  } catch (error) {
      console.error('Error fetching past itineraries:', error);
      throw error; // Rethrow or handle it further up
  }
};
const fetchPastbookedbytouristItinerariesItneraryComment = async (email) => {
  try {
    // Sending a POST request with email in the body
    const response = await axios.post('http://localhost:4000/api/tourists/past-itineraries2', {
      email: email
    });
    return response.data; // Expecting response.data to be the relevant data structure
  } catch (error) {
    console.error('Error fetching past itineraries:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
  
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
        throw error; // propagate the error to be handled where this function is called
    }
    
};

//Admin regest
const registerAdmin = async (adminData) => {
    try {
        const response = await fetch('http://localhost:4000/api/admins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminData),
        });
  
        const data = await response.json();
        if (response.ok) {
            console.log('Admin registered successfully:', data);
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


// a method that handles reading the info of the tour guide by email 

// Function to send a request to retrieve a tour guide record by email
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
        throw error; // Propagate error for further handling
    }
};
// a method that sends a request using axios , to fetch all the tour guides 

const fetchTourGuides = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/tourGuides/');
    return response.data; // Assuming the response data is in JSON format
  } catch (error) {
    console.error('Error fetching tour guides:', error);
    throw error; // You can choose to handle the error further
  }
};


const acceptTourGuide = async (email) => {
  try {
    const response = await axios.post('http://localhost:4000/api/tourGuides/accept-tour-guide', { email });
    console.log("Tour guide accepted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to accept tour guide:", error);
    throw error;
  }
};

const rejectTourGuide = async (email) => {
  try {
    const response = await axios.post('http://localhost:4000/api/tourGuides/reject-tour-guide', { email });
    console.log("Tour guide accepted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to accept tour guide:", error);
    throw error;
  }
};

//-------------------------
// function to create an advertiser and place in database 
const registerAdvertiser = async (advertiserData) => {
    try {
        const response = await fetch('http://localhost:4000/api/advertisers/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(advertiserData),
        });
  
        const data = await response.json();
        if (response.ok) {
            console.log('Advertiser created successfully:', data);
            return data; // Return the created advertiser data for further use
        } else {
            console.error('Error during advertiser creation:', data);
            return null; // Return null in case of an error response
        }
    } catch (error) {
        console.error('Network or server error:', error);
        return null; // Return null if there was a network or server error
    }
  };
  const fetchAdvertiserByEmail = async (data) => {
    try {
      const response = await fetch('http://localhost:4000/api/advertisers/getAdvertiserByEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Error fetching advertiser');
      }
  
      return result;
    } catch (error) {
      console.error('Error fetching advertiser:', error);
      throw error;
    }
  };
  const fetchAdvertisers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/advertisers/');
      return response.data; // Assuming the response data is in JSON format
    } catch (error) {
      console.error('Error fetching advertisers:', error);
      throw error; // You can choose to handle the error further
    }
  };
  const acceptAdvertiser = async (email) => {
    try {
      const response = await axios.post('http://localhost:4000/api/advertisers/acceptadvertisers', { email });
      console.log("Tour guide accepted:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to accept tour guide:", error);
      throw error;
    }
  };
  const rejectAdvertiser = async (email) => {
    try {
      const response = await axios.post('http://localhost:4000/api/advertisers/rejectadvertisers', { email });
      console.log("Tour guide accepted:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to accept tour guide:", error);
      throw error;
    }
  };


//



  const fetchAllItineraries = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/itineraries', {
            method: 'GET', // Use GET method to retrieve data
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Itineraries retrieved successfully:', data);
            return data.data; // Assuming your backend returns an object with a 'data' property containing the itineraries
        } else {
            console.error('Error retrieving itineraries:', data.message);
            return null; // Return null in case of error
        }
    } catch (error) {
        console.error('Network error while fetching itineraries:', error);
        return null; // Return null in case of a network error
    }
};






//----------------------------------------
//seller functions 
//function to create a seller and place in the database 
const registerSeller = async (sellerData) => {
    try {
      // Send the POST request to the backend
      const response = await fetch('http://localhost:4000/api/sellers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellerData), // Send seller data as JSON
      });
  
      // Parse the JSON response
      const data = await response.json();
  
      // Check if the response is successful
      if (response.ok) {
        console.log('Seller registered successfully:', data);
        // You can handle success logic here (e.g., navigate to another page, show success message)
        return data;
      } else {
        // Handle error response from the server
        console.error('Error during seller registration:', data);
        return null; // Return null in case of error
      }
    } catch (error) {
      // Handle network or server errors
      console.error('Network or server error:', error);
      return null; // Return null to signify an error occurred
    }
  };
  const fetchSellerByEmail = async (email) => {
    try {
        const response = await fetch('http://localhost:4000/api/sellers/getSellerByEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }), // Send email as an object
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching seller by email:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
};
const updateSellerByEmail = async (email, updatedData) => {
    try {
      const response = await fetch('http://localhost:4000/api/sellers/updateSeller', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, updatedData }), // Send email and updated data
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      return data; // Handle success
    } catch (error) {
      console.error('Error updating seller:', error);
      throw error; // Handle error
    }
  };

// fetchSellers all sellers 
const fetchSellers = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/sellers/');
    return response.data; // Assuming the response data is in JSON format
  } catch (error) {
    console.error('Error fetching advertisers:', error);
    throw error; // You can choose to handle the error further
  }
};
// acceptSeller , accepting seller based on documents , 
const fetchTourists = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/tourists/');
    return response.data; // Assuming the response data is in JSON format
  } catch (error) {
    console.error('Error fetching advertisers:', error);
    throw error; // You can choose to handle the error further
  }
};

const acceptSeller = async (email) => {
  try {
    const response = await axios.post('http://localhost:4000/api/sellers/acceptsellers', { email });
    console.log("Tour guide accepted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to accept tour guide:", error);
    throw error;
  }
};
// rejectSeller , rejecting sellers based on the documents 
const rejectSeller = async (email) => {
  try {
    const response = await axios.post('http://localhost:4000/api/sellers/rejectsellers', { email });
    console.log("Tour guide accepted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to accept tour guide:", error);
    throw error;
  }
};

  const updateAdvertiserByEmail = async (email, updatedData) => {
    try {
      const response = await fetch(`http://localhost:4000/api/advertisers/updateAdvertiserByEmail`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, ...updatedData }), 
    });
    

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Network response was not ok');
        }

        const data = await response.json();
        console.log("DATA", data)
        console.log("EMAIL",email)
        console.log("updtated data", updatedData)
        return data; // Handle success
    } catch (error) {
        console.error('Error updating advertiser:', error);
        throw error; // Re-throw error to be handled by calling code
    }
};
  

const updateTourGuideByEmail = async (email, updatedData) => {
  try {
    const response = await fetch(`http://localhost:4000/api/tourGuides/updateTourGuideByEmail`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, ...updatedData }), 
  });
  

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Network response was not ok');
      }

      const data = await response.json();
      return data; // Handle success
  } catch (error) {
      console.error('Error updating tourGuide:', error);
      throw error; // Re-throw error to be handled by calling code
  }
};


//-------------------------------------------------------------------------------------------
// New function to get all tags
const fetchAllTags = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/tags', {
            method: 'GET', // Use GET method to retrieve data
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Tags retrieved successfully:', data);
            return data.data; // Assuming your backend returns an object with a 'data' property containing the tags
        } else {
            console.error('Error retrieving tags:', data.message);
            return null; // Return null in case of error
        }
    } catch (error) {
        console.error('Network error while fetching tags:', error);
        return null; // Return null in case of a network error
    }
};

/*
const updateTag = async (tagId, updatedData) => {
    try {
        const response = await fetch('http://localhost:4000/api/tags//update/${tagId}', {
            method: 'PUT', // Use PUT for update
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData), // Send updated data
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error updating tag');
        }

        const result = await response.json(); // Get updated tag data
        console.log('Tag updated successfully:', result);
        return result; // Return updated tag data
    } catch (error) {
        console.error('Error updating tag:', error.message);
        throw error; // Propagate error
    }
};
*/

// Function to delete a tag
/*const deleteTag = async (tagId) => {
    try {
        const response = await fetch(`http://localhost:4000/api/tags/delete/${tagId}`, {
            method: 'DELETE', // Use DELETE for removing a tag
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error deleting tag');
        }

        console.log('Tag deleted successfully');
        return true; // Return true on success
    } catch (error) {
        console.error('Error deleting tag:', error.message);
        throw error; // Propagate error
    }
};*/

const deleteTag = async (tagId)=>{
    const url = `http://localhost:4000/api/tags/deletee/${tagId}`;
    const response = await axios.delete(url);
    return response.data
}

const updateTag = async (tagId ,updatedData) =>{
    console.log(updatedData)
    const url = `http://localhost:4000/api/tags/update/${tagId}`;
    const response = await axios.patch(url, updatedData);
    return response.data;
}
//----------------------------------------------------------------
//Admin request sending methods 
const BASE_URL = 'http://localhost:4000/api/admins/';
const addAdmin = async (adminData) => {
    try {
        console.log("admin data before sending : ", adminData)
        //adminData = {email : adminData.email, name : adminData.username, password : adminData.password}
        //console.log("admin data before sending 2: ", adminData)
        const response = await axios.post(BASE_URL, adminData);
        return response.data; // Return the response data from the server
    } catch (error) {
        console.error('Error creating admin:', error.response ? error.response.data : error.message);
        throw error; // Propagate the error for handling in the component
    }
};
const BASE_URL2 = 'http://localhost:4000/api/tourismGoverners/';

const addTourismGoverner = async (tourismGovernerData) => {
    try {
        const response = await axios.post('http://localhost:4000/api/tourismGoverners/', tourismGovernerData);
        console.log(response.data); // Handle the response data as needed
        return response.data; // Return the response data for further use
    } catch (error) {
        console.error('Error adding Tourism Governer:', error.response ? error.response.data : error.message);
        throw error; // Throw the error for further handling if necessary
    }
};
//---------------------------
// method that sends a request to get all tourist accounts 

// Function to send a request to filter activities
const filterActivities = async (filterCriteria) => {
  try {
      const response = await axios.post('http://localhost:4000/api/activities/filterYassin', filterCriteria);
      return response.data; // Return the filtered activities
  } catch (error) {
      console.error('Error fetching activities:', error);
      throw error; // Rethrow error for handling in calling code
  }
};
const filterItineraries = async (filterCriteria) => {
  try {
    const response = await axios.post('http://localhost:4000/api/itineraries/filter', filterCriteria);
    return response.data; // Return the filtered itineraries
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    throw error; // Rethrow error for handling in calling code
  }
};

const getTagNames = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/tags/tags/names');
    return response.data; // Assuming the data is an array of tag names
  } catch (error) {
    throw new Error('Failed to fetch tags');
  }
};
const filterMuseumByTagName = async (tagName) => {
  try {
    const response = await fetch('http://localhost:4000/api/historicalPlaces/filterByTag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tagName }), // Send the selected tag name in the request body
    });

    if (!response.ok) {
      throw new Error('Failed to filter museums');
    }

    const museums = await response.json();
    return museums;
  } catch (error) {
    console.error('Error filtering museums:', error);
    throw error;
  }
};
const filterProductsByPrice = async ({ minPrice, maxPrice }) => {
  const response = await axios.get(`http://localhost:4000/api/products/filter`, {
    params: {
      minPrice,
      maxPrice,
    },
  });
  return response.data; // Assuming the backend returns the data in this structure
};


/// 
export const sendComplaint = async (complaintData) => {
  try {
      const response = await axios.post('http://localhost:4000/api/complaints/submit', complaintData);
      console.log('Response data:', response.data); // Log the response data
      return response.data;
  } catch (error) {
      console.error('Error response:', error.response); // Log the error response
      if (error.response) {
          throw new Error(error.response.data.error || 'Something went wrong');
      }
      throw error;
  }
};
const fetchComplaintsByEmail = async (email) => {
  try {
    const response = await fetch(`http://localhost:4000/api/complaints/my-complaints?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include any necessary headers, e.g., authentication tokens
      },
    });

    if (!response.ok) {
      const errorData = await response.json(); // Attempt to get error details
      throw new Error(`Failed to fetch complaints: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchComplaintsByEmail:", error);
    throw error; // Rethrow error for handling in calling function
  }
};
const bookItem = async (bookingData) => {
  try {
    const response = await fetch('http://localhost:4000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData), // Send booking details in the request body
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Booking successful:', data);
      return data; // Return the booking data if successful
    } else {
      console.error('Booking failed:', data.message);
      return null; // Return null in case of an error response
    }
  } catch (error) {
    console.error('Network error while booking:', error);
    return null; // Return null in case of a network error
  }
};

const fetchPurchasedProducts = async (email) => {
  try {
    console.log(email);
    const response = await axios.post(`http://localhost:4000/api/tourists/purchased`, {
       email  // Send the tourist's email as a query parameter
    });
    return response.data; // Handle the response as needed
  } catch (error) {
    console.error('Error fetching purchased products:', error);
    throw error; // Rethrow or handle it further up
  }
};
const fetchPastActivities = async (email) => {
  try {
    const response = await axios.post('http://localhost:4000/api/tourists/past-activities', { email });
    return response.data;  // Returning the list of past activities
   
  } catch (error) {
    console.error('Error fetching past activities:', error);
    throw new Error('Could not fetch past activities');
  }
  
};
const rateProduct = async (productId, rating) => {
  try {
    const response = await axios.patch('http://localhost:4000/api/tourists/rate/', {
      productId: productId,  // Send the product's ID
      rating: rating          // Send the rating
    });
    return response.data;  // Handle the response as needed
  } catch (error) {
    console.error('Error rating product:', error);
    throw error;  // Rethrow or handle it further up
  }
};
const rateItinerary = async (itineraryId, rating) => {
  try {
    console.log("itineraryId : ", itineraryId);
    console.log("rating : ", rating);
    const response = await axios.patch('http://localhost:4000/api/tourists/rate-itinerary', {    // Send the tourist's ID
      itineraryId: itineraryId, // Send the itinerary's ID
      rating: rating            // Send the rating
    });
    return response.data;  // Handle the response as needed
  } catch (error) {
    console.error('Error rating itinerary:', error);
    throw error;  // Rethrow or handle it further up
  }
};
const rateactivity = async (activityname, rating) => {
  try {
    const response = await axios.patch('http://localhost:4000/api/tourists/rate-activity', {    // Send the tourist's ID
    activityname: activityname, // Send the itinerary's ID
      rating: rating            // Send the rating
    });
    return response.data;  // Handle the response as needed
  } catch (error) {
    console.error('Error rating itinerary:', error);
    throw error;  // Rethrow or handle it further up
  }
};

const rateTourGuide = async (email, rating) => {
  try {
    const response = await axios.patch('http://localhost:4000/api/tourists/rate-tour-guide', {      // Send the tourist's ID
      email: email,  
      rating: rating             // Send the rating
    });
    return response.data;  // Handle the response as needed
  } catch (error) {
    console.error('Error rating tour guide:', error);
    throw error;  // Rethrow or handle it further up
  }
};
const purchaseProduct = async (email, productId) => {
  try {
      const response = await axios.post('http://localhost:4000/api/tourists/purchase', {
          email: email,          // Send the tourist's email
          productId: productId   // Send the product's ID
      });

      if (response.status === 200) {
          console.log('Product purchased successfully:', response.data.message);
          return response.data; // Handle the success response as needed
      } else {
          console.error('Error purchasing product: haa', response.data.message);
          throw new Error(response.data.message); // Handle error responses from the server
      }
  } catch (error) {
      console.error('Error purchasing product: ooo', error.message);
      throw error; // Rethrow or handle it further up
  }
};

const deletAdvertiser = async (userId) => {
  try {
      const response = await axios.delete(`http://localhost:4000/api/advertisers/${userId}`);
      console.log("true")
      return response.data;
  } catch (error) {
      throw error;
  }
};
const deleteTourGuide = async (userId) => {
  try {
    const response = await axios.delete(`http://localhost:4000/api/tourGuides/${userId}`);
    console.log("true")
    return response.data;
} catch (error) {
    throw error;
} 
}
const deleteSeller = async (userId) => {
  try {
      console.log("Making DELETE request for user ID:", userId);  // Debugging log
      const response = await axios.delete(`http://localhost:4000/api/sellers/${userId}`);
      console.log("Seller successfully deleted:", response.data);
      return response.data;
  } catch (error) {
      console.error("Error deleting seller:", error.response || error.message || error);
      throw new Error('Failed to delete seller account. Please try again later.');
  }
};


const getActivitieswithAdvertiserId = async (userId) => {
  try {
      const response = await axios.post(`http://localhost:4000/api/advertisers/${userId}/advertisers`, {
        userId  

          
      });
      console.log("trial Advertiser",userId)
      return response.data;
  } catch (error) {
      console.error("Error fetching touriadvertiderst by id:" ,userId, error);
      throw new Error("Failed to fetch advertider data");  // Re-throw the error
  }
};
 const getTourGuideByEmail = async(email) => {
  try {
    const response = await axios.post(`http://localhost:4000/api/tourGuides/getByEmail`, {
      email  

        
    });
    console.log("trial TourGuide",email)
    return response.data;
} catch (error) {
    console.error("Error fetching tour Guide by email:" ,email, error);
    throw new Error("Failed to fetch tour guide data");  // Re-throw the error
}
}


// Export the new method along with others
export { registerTourist,fetchAllItineraries, fetchTouristByEmail, updateTouristByEmail, createTourGuideRequest, fetchTourGuideByEmail,fetchAllTags,updateTag,deleteTag,addAdmin,addTourismGoverner,
  registerAdvertiser,registerSeller,fetchSellerByEmail,updateSellerByEmail,fetchAdvertiserByEmail,filterActivities,filterItineraries,getTagNames,filterMuseumByTagName,filterProductsByPrice,updateAdvertiserByEmail,fetchTourGuides,acceptTourGuide,rejectTourGuide,
  fetchAdvertisers,acceptAdvertiser,rejectAdvertiser,fetchSellers,acceptSeller,rejectSeller,fetchPastbookedbytouristItineraries,
  fetchPastbookedbytouristItinerariesItneraryComment,fetchComplaintsByEmail,fetchPurchasedProducts,rateProduct,rateItinerary,rateTourGuide,purchaseProduct,fetchPastActivities,
  rateactivity,bookItem ,deleteSeller,updateTourGuideByEmail ,updateTouristByEmailT,deletAdvertiser,deleteTourGuide ,getActivitieswithAdvertiserId,getTourGuideByEmail,fetchTourists};
