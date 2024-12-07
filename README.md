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

#For All Users :

### Authentication and Account Management
•⁠  ⁠Login using a username and password.
•⁠  ⁠Change password securely.
•⁠  ⁠Recover a forgotten password via OTP sent to email.
•⁠  ⁠Create, read, and update a seller profile, including name and description, upon acceptance into the system.
•⁠  ⁠Upload a profile picture.
•⁠  ⁠Accept terms and conditions upon registration or system updates.
•⁠  ⁠Request account deletion from the system.



##For Tourist :

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



---

## Code Examples

```javascript
// Example: Fetching flight offers from the API
axios.get('/api/flights', {
  params: { origin: 'NYC', destination: 'LAX', date: '2024-12-25' }
})
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
