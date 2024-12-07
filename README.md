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

### Known Issues:
- **Navigation Challenges**:  
  Users may find it difficult to navigate the site if the layout or menu system is not intuitive.  

- **Inadequate Error Handling**:  
  Missing or unclear error messages can confuse users when something goes wrong (e.g., failed bookings or API errors).  

- **Accessibility Barriers**:  
  Lack of accessibility features (e.g., screen reader support, keyboard navigation) could make the site unusable for some users.  

Plans are in place to address these issues, add more automated tests, and expand the documentation in future updates.


---

## Code Style

We follow industry best practices using the [Prettier](https://prettier.io/) code formatter and [ESLint](https://eslint.org/) for linting.

---

## Screenshots

![Homepage Screenshot](screenshots/homepage.png)  
*Caption: A view of the homepage with featured destinations.*  

---

## Tech/Framework Used

- **Frontend**: React.js  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **API Integration**: Amadeus API, Google Maps API  

---

## Features

- Explore and book itineraries, activities, and flights.  
- Share activities via copy link or email.  
- Manage user accounts for tourists and tour guides.  
- Dynamic location mapping with Google Maps integration.  
- Search and filter activities by category and tags.  

---

## Code Examples

```javascript
// Example: Fetching flight offers from the API
axios.get('/api/flights', {
  params: { origin: 'NYC', destination: 'LAX', date: '2024-12-25' }
})
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
