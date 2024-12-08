# Very Good Travel App

**A modern, feature-rich travel app designed to enhance your travel experience with ease and convenience.**

---

## Table of Contents

1. [Motivation](#motivation)  
2. [Build Status](#build-status)  
3. [Code Style](#code-style)  
4. [Screenshots](#screenshots)  
5. [Tech/Framework Used](#techframework-used)  
6. [Features](#features)  
7. [Code Examples](#code-examples)  
8. [Installation](#installation)  
9. [API References](#api-references)  
10. [Tests](#tests)  
11. [How to Use](#how-to-use)  
12. [Contribute](#contribute)  
13. [Credits](#credits)  
14. [License](#license)  

---

## Motivation

Travel planning should be simple, intuitive, and enjoyable. **Very Good Travel App** was built to provide tourists and travel enthusiasts with tools to book activities, itineraries, and flights, share experiences, and explore destinations seamlessly.

---

## Build Status

This project is currently under development and is not suitable for production use.  

### Current Issues:
- **Navigation Challenges**:  
  Users find it difficult to navigate the site due to an unintuitive layout and menu system.  

- **Inadequate Error Handling**:  
  Missing or unclear error messages confuse users when something goes wrong (e.g., failed bookings or API errors).  

- **Accessibility Barriers**:  
  The site lacks important accessibility features (e.g., screen reader support, keyboard navigation), making it unusable for some users.  

We are actively working on addressing these issues, adding more automated tests, and expanding the documentation in future updates.



---

## Code Style

We follow industry best practices using the [ESLint](https://eslint.org/) for linting.

---

## Screenshots

![Homepage Screenshot](screenshots/homepage.png)  
*Caption: A view of the homepage with featured destinations.*  

---

## Tech/Framework Used

### Backend:
- **Node.js** – JavaScript runtime for building scalable network applications.
- **Express.js** – Web framework for Node.js to build web applications and APIs.
- **Mongoose** – MongoDB object modeling tool for Node.js.
- **bcrypt** – Library to hash passwords.
- **jsonwebtoken (JWT)** – Library to generate JSON Web Tokens for secure authentication.
- **dotenv** – Module to load environment variables from a `.env` file.
- **nodemailer** – Module for sending emails from Node.js.
- **multer** – Middleware for handling file uploads in Node.js.
- **node-cron** – Task scheduler for running cron jobs in Node.js.
- **stripe** – Library for integrating Stripe payments.
- **Amadeus APIs** – A set of APIs for accessing travel-related services, including flight and hotel bookings, and more.

### Frontend:
- **React.js** – JavaScript library for building user interfaces.
- **React Router** – Routing library for React applications.
- **Axios** – Promise-based HTTP client for the browser and Node.js.
- **Stripe React Library** – React bindings for integrating Stripe’s payment system.
- **FontAwesome** – Library for scalable vector icons.
- **@react-google-maps/api** – Library for integrating Google Maps in React applications.
- **React Scripts** – Set of scripts for building and running React applications.
- **cross-env** – Package to set environment variables in scripts across different OS.

---

## Features

The website offers the following features for Tourists:

## For All Users :

### Authentication and Account Management
•⁠  ⁠Login using a username and password.
•⁠  ⁠Change password securely.
•⁠  ⁠Recover a forgotten password via OTP sent to email.
•⁠  ⁠Create, read, and update a seller profile, including name and description, upon acceptance into the system.
•⁠  ⁠Upload a profile picture.
•⁠  ⁠Accept terms and conditions upon registration or system updates.
•⁠  ⁠Request account deletion from the system.



## For Tourist :

### User Profile Management
•⁠  ⁠Update profile information, including wallet details.
•⁠  ⁠Set vacation preferences (e.g., historic areas, beaches, budget-friendly options, etc.).

### Search and Discovery
•⁠  ⁠Search for specific museums, historical places, activities, or itineraries by name, category, or tags.
•⁠  ⁠Choose preferred currency to view prices.

### Booking and Payments
•⁠  ⁠Book flights, hotels, and transportation through third-party applications.
•⁠  ⁠Book tickets for events, activities, or itineraries directly on the platform.
•⁠  ⁠Pay for bookings using:
  - Credit card or debit card (via Stripe integration).
  - Wallet balance (if available).
•⁠  ⁠Cancel bookings up to 48 hours before the start of the event/activity or itinerary.
•⁠  ⁠View the refunded amount from cancellations in the wallet.
•⁠  ⁠Receive payment receipts via email.

### Event and Itinerary Management
•⁠  ⁠View and manage:
  - Upcoming activities and itineraries.
  - Past activities and itineraries (history).
•⁠  ⁠Bookmark and save events for later viewing.
•⁠  ⁠Receive notifications about:
  - Upcoming bookings via email or in-app.
  - Events of interest starting their booking phase.
•⁠  ⁠Share activities, museums, historical places, or itineraries via email or copy link.

### Reviews and Ratings
•⁠  ⁠Rate and comment on:
  - Tour guides after completing a tour.
  - Itineraries created by tour guides.
  - Events or activities attended.

### Rewards and Loyalty
•⁠  ⁠Earn loyalty points upon payments for events/itineraries.
•⁠  ⁠Redeem points as cash into the wallet.
•⁠  ⁠Receive badges based on user level.

### Wishlist and Shopping
•⁠  ⁠Save products to a wishlist for future reference.
•⁠  ⁠Add or remove items from the cart.
•⁠  ⁠Modify quantities of items in the cart.
•⁠  ⁠Checkout and pay using:
  - Wallet balance.
  - Credit card (via Stripe).
  - Cash on delivery.
•⁠  ⁠View current and past orders.
•⁠  ⁠Rate and review purchased products.

### Complaint and Support
•⁠  ⁠File complaints with details like title, body, and date.
•⁠  ⁠Track complaint statuses (pending/resolved).

### Promotions and Discounts
•⁠  ⁠Receive promo codes (e.g., birthday discounts) via email and in-app.
•⁠  ⁠Use promo codes for purchases across the platform.

## For Seller :

### Product Management
•⁠  ⁠Add new products with the following details:
  - Name
  - Price
  - Description
  - Available quantity
•⁠  ⁠Upload product images.
•⁠  ⁠Edit product details, including price and description.
•⁠  ⁠Archive and unarchive products as needed.

### Inventory and Notifications
•⁠  ⁠View available quantity and sales data for each product.
•⁠  ⁠Receive notifications via email and system alerts when a product goes out of stock.

### Sales and Revenue Reports
•⁠  ⁠View a detailed sales report containing revenue data.
•⁠  ⁠Filter sales reports by product, date, or month.

### Product Discovery
•⁠  ⁠Provide a list of all available products, including:
  - Product images
  - Prices
  - Descriptions
  - Ratings and reviews
•⁠  ⁠Search for products based on their names.
•⁠  ⁠Filter products by price.
•⁠  ⁠Sort products by ratings.

## For Tour Guide :

### Itinerary Management
•⁠  ⁠Create, read, update, and delete itineraries with detailed information, including:
  - Activities included in the itinerary.
  - Locations to be visited.
  - Timeline and duration of each activity.
  - Language of the tour.
  - Price of the tour.
  - Available dates and times.
  - Accessibility options.
  - Pickup/drop-off locations.
•⁠  ⁠Activate or deactivate itineraries with existing bookings.
•⁠  ⁠Create, read, update, and delete tourist-specific itineraries for a defined date range, including tags and all associated details.

### Notifications
•⁠  ⁠Receive system notifications when:
  - An event or itinerary is flagged as inappropriate by an admin.
•⁠  ⁠Receive email notifications for flagged events or itineraries.

### Reports and Analytics
•⁠  ⁠View a sales report containing revenue details for itineraries and activities.
•⁠  ⁠Filter sales reports by:
  - Activity
  - Itinerary
  - Date
  - Month
•⁠  ⁠View reports on the total number of tourists who:
  - Used an itinerary.
  - Attended an activity.
•⁠  ⁠Filter the total number of tourist reports by month.

### Itinerary Management
•⁠  ⁠View a list of all created Itineraris

## For Advertiser :

### Account and Profile Management  
•⁠  ⁠Create, read, and update a profile with detailed information, including:  
  - Link to the company website.  
  - Hotline.  
  - Company profile.  
  - Other relevant details (if accepted as an advertiser on the system).  

•⁠  ⁠Upload a company logo or related image.  
•⁠  ⁠Accept the terms and conditions upon account approval or updates.  
•⁠  ⁠Request account deletion from the system.  

### Activity Management  
•⁠  ⁠Create, read, update, and delete activities with comprehensive details, such as:  
  - Date and time of the activity.  
  - Location (integrated with Google Maps).  
  - Price or price range.  
  - Category, tags, and any special discounts.  
  - Whether bookings are open or closed.

### Transportation Management  
•⁠  ⁠Create, read, update, and delete Transportations with comprehensive details, such as:  
  - Date and time of the Transportation.  
  - Pickup Location.
  - DropOff Location.   
  - Price.

### Reporting and Analytics  
•⁠  ⁠View a sales report containing all revenue generated through activities.  
•⁠  ⁠Filter sales reports by:  
  - Activity.  
  - Date.  
  - Month.  
•⁠  ⁠View reports detailing the total number of participants or tourists attending activities.  
•⁠  ⁠Filter participant reports by month.  

### Notifications  
•⁠  ⁠Receive system notifications when:  
  - An activity is flagged as inappropriate by the admin.  
•⁠  ⁠Receive email notifications for flagged activities.  

### View and Manage Content  
•⁠  ⁠Access a list of all created activities, transportations.

## For Tourism Governer :

The website offers the following features for the *Tourism Governor*:  

### Account and Profile Management  
•⁠  ⁠Change account password.  
•⁠  ⁠Recover password using an OTP sent to the registered email.  

### Museum and Historical Places Management  
•⁠  ⁠Create, read, update, and delete museums and historical places with comprehensive details, including:  
  - Description of the place.  
  - Pictures.  
  - Location (with Google Maps integration).  
  - Opening hours.  
  - Ticket prices.  

### Tag Management  
•⁠  ⁠Create tags for different historical locations based on attributes such as:  
  - Type (e.g., museum, cultural landmark).  
  - Historical period (e.g., Medieval, Renaissance).  

## For Admin :

### Account Management  
•⁠  ⁠Change account password.  
•⁠  ⁠Recover password using an OTP sent to the registered email.  
•⁠  ⁠Add new *Tourism Governors* and *Admins* to the system by creating a unique username and password.  

### User and Content Moderation  
•⁠  ⁠View documents uploaded by *Tour Guides, **Advertisers, and **Sellers* during registration.  
•⁠  ⁠Accept or reject registration requests for *Tour Guides, **Advertisers, and **Sellers* based on uploaded documents.  
•⁠  ⁠Delete user accounts off the system.  
•⁠  ⁠Flag an event or itinerary deemed inappropriate.  

### Complaint Management  
•⁠  ⁠View a list of all complaints issued along with their statuses (pending/resolved).  
•⁠  ⁠View the details of a selected complaint.  
•⁠  ⁠Mark complaints as pending or resolved.  
•⁠  ⁠Reply to complaints issued by users.  
•⁠  ⁠Sort complaints by date.  
•⁠  ⁠Filter complaints by their status.  

### Product Management  
•⁠  ⁠View a list of all available products, including:  
  - Product details (picture, price, description, ratings, and reviews).  
  - Available quantity and sales of each product.  
•⁠  ⁠Add products with their details (price, description, available quantity).  
•⁠  ⁠Upload product images.  
•⁠  ⁠Edit product details and pricing.  
•⁠  ⁠Archive or unarchive products.  
•⁠  ⁠Receive notifications when products are out of stock on the system (both in the system and via email).  

### Reporting and Analytics  
•⁠  ⁠View a sales report containing all revenue generated from:  
  - Events.  
  - Itineraries.  
  - Gift shop sales.  
•⁠  ⁠Filter sales reports based on a product, date, or month.  
•⁠  ⁠View total registered users and the number of new users added per month.  

### Activity and Tag Management  
•⁠  ⁠Create, read, update, and delete activity categories such as:  
  - Food.  
  - Stand-up comedy.  
  - Concerts.  
  - Parties.  
  - Exhibitions.  
  - Sports matches/events.  
  - Parks.  
•⁠  ⁠Create, read, update, and delete preference tags, including:  
  - Historic areas.  
  - Beaches.  
  - Family-friendly.  
  - Shopping.  
  - Budget-friendly.  

### Promotions Management  
•⁠  ⁠Create promotional codes for discounts on events, itineraries, or products.




---

## Code Examples

### a snippet from the tourist Controller

```javascript
const createTourist = async (req, res) => {
  try {
    // Destructure the request body to get user details
    const { name, email, password, mobile, nationality, dob, job} = req.body;

    // Create a new user instance with the role of tourist
    const newUser = new Tourist({
      name,
      email,
      password,
      mobile,
      nationality,
      dob,
      job 
      // No need to set bookedItineraries, createdItineraries, or wallet; they will default to appropriate values
    });

    // Save the user to the database
    await newUser.save();

    // Send success response
    res.status(200).json({
      message: 'Tourist created successfully',
      tourist: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        nationality: newUser.nationality,
        dob: newUser.dob,
        job: newUser.job,
      }
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(400).json({
      message: 'Error creating tourist',
      error: error.message
    });
  }
};


const getTourist = async (req, res) => {
    try {
        const users = await Tourist.find(); // Fetch all users from the database
        res.status(200).json({
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving users',
            error: error.message
        });
    }
};

```
### a snippet from the tourist Routes

```javascript
router.get('/', getTourist)
router.post('/', createTourist)
```

### a snippet from the server.js File

```javascript
const touristRoutes = require('./routes/tourists')
app.use('/api/tourists', touristRoutes)
```

### a snippet from the FrontEnd requestSendingMethods File

```javascript

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
```
### a snippet from the frontend for creating a tourist

```javascript
    // Handle tourist registration
    if (role === "tourist") {
      let touristData = {
        name: formElements.username.value,
        email: formElements.email.value,
        password: formElements.password.value,
        mobile: formElements.mobile.value,
        dob: formElements.dob.value,
        nationality: formElements.nationality.value,
        job: formElements.job.value,
        
      };
      await registerTourist(touristData);
      navigate("/tourist");
    }
```

## Installation

To get started with the project, follow the steps below to install and set up the backend and frontend.

### Prerequisites

Before installing, ensure that you have the following installed on your system:

- [Node.js](https://nodejs.org/en/) (>= v14.x)
- [npm](https://www.npmjs.com/) (>= v6.x)
- [MongoDB](https://www.mongodb.com/) (for database setup)### Backend Installation

###Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/Advanced-computer-lab-2024/Very-good.git
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   MONGO_URI=your-mongodb-uri
   JWT_SECRET=your-jwt-secret
   STRIPE_SECRET_KEY=your-stripe-secret-key
   EMAIL_USER=maranmalak@gmail.com
   EMAIL_PASS="your password"
   ```

5. Start the server:
   ```bash
   node server.js
   ```
   
###Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontendTemp
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   REACT_APP_STRIPE_PUBLIC_KEY=your-stripe-public-key
   ```

4. Start the frontend:
   ```bash
   npm start
   ```
   ---
## API References
   ### activities route file
   ```javascript
       
router.get('/', getActivities); 
// Endpoint to the backend controller that fetches all activities

router.get('/search', searchactivity); 
// Endpoint to the backend controller that allows searching for an activity by name

router.get('/:id', getActivityById); 
// Endpoint to fetch an activity by its ID

router.post('/', createActivity); 
// Endpoint to the controller function that creates an activity

router.post('/addComment', addCommentToActivity); 
// Endpoint to the backend controller function that allows adding a comment to an activity

router.post('/filterYassin', filterActivitiesyassin); 
// Endpoint to a backend controller that filters activities based on some categories

  ```
  ### admin route file
  ```javascript

router.post('/', createAdmin); 
// Endpoint to the backend controller that creates a new admin

router.get('/getadmintag', getTags); 
// Endpoint to the backend controller that gets all tags

router.post('/createadmintag', createTag); 
// Endpoint to the backend controller that creates a new tag

router.patch('/updateadmintag/:id', updateTag); 
// Endpoint to the backend controller that updates an existing tag by ID

router.delete('/deleteadmintag/:id', deleteTag); 
// Endpoint to the backend controller that deletes a tag by ID

router.put('/itinerary/:itineraryId/flag', flagItinerary); 
// Endpoint to the backend controller that handles flagging/unflagging an itinerary

router.get('/', getAdmins); 
// Endpoint to the backend controller that fetches all admins

router.get('/getUserStatistics', getUserStatistics); 
// Endpoint to the backend controller that handles statistics on numbers of users

```
### advertisers Route File 
  ```javascript
router.get('/', getAdvertisers); 
// Endpoint to the backend controller that handles fetching all advertisers

router.get('/:id/activities', getActivitieswithAdvertiserId); 
// Endpoint to the backend controller that fetches activities for an advertiser with a specific ID

router.delete('/:id/activities', deleteActivityById); 
// Endpoint to the backend controller that deletes an activity with a specific ID

router.put('/:id/activities', updateActivityWithId); 
// Endpoint to the backend controller that updates an activity with a specific ID

router.delete('/:id', deleteAdvertiser); 
// Endpoint to the backend controller that deletes an advertiser with a specific ID

router.post('/getAdvertiserByEmail', fetchAdvertiserByEmail); 
// Endpoint to the backend controller that fetches an advertiser by email

router.post('/', createAdvertiser); 
// Endpoint to the backend controller that handles creating a new advertiser

router.put('/updateAdvertiserByEmail', updateAdvertiserByEmail); 
// Endpoint to the backend controller that updates an advertiser by email

router.put('/:advertiserId/accepted-terms', updateAcceptedTermsAndConditions); 
// Endpoint to the backend controller that handles an advertiser accepting terms and conditions

router.post(
    '/upload/:email', 
    uploadAdvertiser.fields([
        { name: 'IdDocument', maxCount: 1 },
        { name: 'taxationRegistryCard', maxCount: 10 }
    ]), 
    uploadDocuments
); 
// Endpoint to the middleware and backend controller that handles advertiser document uploads

router.post(
    '/uploadPhoto/:email', 
    uploadAdvertiser.single('photo'), 
    uploadPhoto
); 
// Endpoint to the middleware and backend controller that handles advertiser photo uploads

router.post('/acceptadvertisers', acceptAdvertiser); 
// Endpoint to the backend controller that handles an admin accepting an advertiser

router.post('/rejectadvertisers', rejectadvertiser); 
// Endpoint to the backend controller that handles an admin rejecting an advertiser
```
### bookingRoutes routes file 
  ```javascript
router.post('/', bookingController.createBooking);
 //EndPoint to the backend Controller that handles the act of tourist booking either an event or an itinerary 
router.patch('/cancel/:bookingId', bookingController.cancelBooking);
// EndPoint to the backend Controller that handles Cancelling a booking 
router.get('/:touristId', bookingController.getBookings);
//EndPoint to the backend Controller that fetches all the booking of the calling tourist
 ```
### category routes file 


