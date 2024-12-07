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

```javascript
// Example: Fetching flight offers from the API
axios.get('/api/flights', {
  params: { origin: 'NYC', destination: 'LAX', date: '2024-12-25' }
})
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
