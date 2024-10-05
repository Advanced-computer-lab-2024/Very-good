import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom'; // For navigation
import './styles/global.css';
import TouristPage from './Pages/TouristPage';
import AdminPage from './Pages/adminpage';
import AdvertiserPage from './Pages/AdvertiserPage'; 
import TourismGovernerPage from './Pages/TourismGovernerPage'; 
import TourGuideHomePage from './Pages/tourGuideHomePage'; 
import { Tourist, fetchTouristByEmail, createTourGuideRequest, registerAdmin ,registerTourist,} from './RequestSendingMethods';
import {LoadScript } from '@react-google-maps/api';

function App() {
  const [action, setAction] = useState(''); // Tracks the user's action (register or sign in)
  const [registrationType, setRegistrationType] = useState(''); // Tracks if user is individual or organization
  const [role, setRole] = useState(''); // Tracks the selected role
  const [step, setStep] = useState(1); // Tracks if we're on the initial or detailed form
  const [isTouristPageActive, setIsTouristPageActive] = useState(false); // Should we render tourist page
  const [isAdvertiserPageActive, setIsAdvertiserPageActive] = useState(false); // Should we render tourist page
  const [isTourismGovernerPageActive, setTourismGovernerPageActive] = useState(false); // Should we render tourist page
  const [isTourGuidePageActive, setIsTourGuidePageActive] = useState(false); // Should we render tour guide page
  const [isAdminPageActive, setIsAdminPageActive] = useState(false); // Should we render tourist page
  const [emailagain, setEmail] = useState(''); // Holds the tourist email
  const [emailtourguide, setEmailTourGuide] = useState(''); // Holds the tour guide email

  //setIsAdminPageActive


  // Function to handle action selection
  const handleActionSelection = (selectedAction) => {
    setAction(selectedAction);
  };

  // Function to handle proceeding to the next step (after role selection)
  const handleProceed = (event) => {
    event.preventDefault(); // Prevent the default form behavior
    setStep(2); // Move to the next step which is the detailed form based on role
  };

  // Function to handle form submission (register button click)
  const handleRegister = async (event) => {
    console.log("Register button clicked");
    event.preventDefault(); // Prevent the default form submission behavior
    const formElements = event.target.elements;

    // Based on the role, set state to render the tourist or tour guide page if applicable
    if (role === 'tourist') {
      // Collect the form data
      let touristData = {
        name: event.target.username.value,
        email: event.target.email.value,
        password: event.target.password.value,
        mobile: event.target.mobile.value,
        dob: event.target.dob.value,
        nationality: event.target.nationality.value,
        job: event.target.job.value,
      };

      // Pass it to a function
      setIsTouristPageActive(true);
      // BACKEND CONNECTION - Update the database
      await registerTourist(touristData);
    } 
    
    if (role === 'tourGuide') {
      // Collect the form data
      let tourGuideData = {
        name: formElements.username.value,
        email: formElements.email.value,
        password: formElements.password.value,
        mobile: formElements.mobile.value,
        dob: formElements.dob.value,
        nationality: formElements.nationality.value,
        yearsOfExperience: formElements.experience.value,
        previousJob: formElements.previousWork.value,
      };

      // Render the tour guide home page
      setIsTourGuidePageActive(true);

      // BACKEND CONNECTION - Update the database
      await createTourGuideRequest(tourGuideData);
    }
    if (role === 'admin') {
      // Collect the form data
      let adminData = {
        name: event.target.username.value,
        email: event.target.email.value,
        password: event.target.password.value,
        mobile: event.target.mobile.value,
        
      };

      // Pass it to a function
      setIsAdminPageActive(true);
      // BACKEND CONNECTION - Update the database
      await registerAdmin(adminData);
    } 
    // Handle other roles or proceed with registration
    if (role === 'tourismGovernor') {
      // Handle tourism governor registration
    }

    if (role === 'seller') {
      // Handle seller registration
    }

    if (role === 'advertiser') {
      // Handle advertiser registration
    }

    console.log(`Role selected: ${role}`);
      // BACKEND CONNECTION As in Update The dataBase 
    if (role === 'advertiser') {
      setIsAdvertiserPageActive(true);
      // BACKEND CONNECTION As in Update The dataBase 
    }
    if (role === 'tourismGovernor') {
      setTourismGovernerPageActive(true);
      // BACKEND CONNECTION As in Update The dataBase 
    }
    else {
      // Handle other roles or proceed with registration
      console.log(`Role selected: ${role}`);
      // Implement other role redirects here if necessary
    }
  };

  return (
    <div className="container">
      {/* Render Tourist Page if active */}
      {isTouristPageActive ? (
        <TouristPage email={emailagain} />
      ) : isTourGuidePageActive ? (
        <TourGuideHomePage email={emailtourguide} />
      ) :
      isAdvertiserPageActive ? (
        <LoadScript googleMapsApiKey="AIzaSyAbrhlteb_a1DkS0Jp1tU9fLD5Hi-j2CrA">
        <AdvertiserPage />
        </LoadScript>
      ) :
      isTourismGovernerPageActive ? (
        <TourismGovernerPage/>
      ) :
      isAdminPageActive ? (
        <AdminPage />
      ) :
      (
        <>
          {/* Welcome Message and Action Selection */}
          {action === '' && (
            <div className="welcome-message">
              <h1>Welcome to the Very Good Travel App</h1>
              <p>Please select an action:</p>
              <button onClick={() => handleActionSelection('register')}>Register</button>
              <button onClick={() => handleActionSelection('signin')}>Sign In</button>
            </div>
          )}

          {/* Registration Type Selection */}
          {action === 'register' && step === 1 && (
            <div className="form-container">
              <h2 className="form-header">Register</h2>
              <form onSubmit={handleProceed}>
                <label htmlFor="registrationType">Are you registering as an individual or an organization?</label>
                <select
                  id="registrationType"
                  value={registrationType}
                  onChange={(e) => setRegistrationType(e.target.value)}
                  required
                >
                  <option value="">Select type</option>
                  <option value="individual">Individual</option>
                  <option value="organization">Organization</option>
                </select>

                {registrationType === 'individual' && (
                  <>
                    <label htmlFor="role">Select your role:</label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      <option value="">Select role</option>
                      <option value="tourist">Tourist</option>
                      <option value="tourGuide">Tour Guide</option>
                      <option value="tourismGovernor">Tourism Governor</option>
                      <option value="admin">Admin</option>


                    </select>
                  </>
                )}

                {registrationType === 'organization' && (
                  <>
                    <label htmlFor="role">Select your role:</label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      <option value="">Select role</option>
                      <option value="seller">Seller</option>
                      <option value="advertiser">Advertiser</option>
                    </select>
                  </>
                )}

                <button type="submit" className="btn proceed-btn">Proceed</button>
                <button type="button" className="btn" onClick={() => setAction('')}>Back</button>
              </form>
            </div>
          )}

          {/* Detailed Registration Form */}
          {action === 'register' && step === 2 && (
            <div className="form-container">
              <h2 className="form-header">Complete Your {role} Registration</h2>
              <form onSubmit={handleRegister}>
                {role === 'tourist' && (
                  <>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required onChange={(e) => setEmail(e.target.value)} />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />

                    <label htmlFor="mobile">Mobile Number:</label>
                    <input type="tel" id="mobile" name="mobile" required />

                    <label htmlFor="dob">Date of Birth:</label>
                    <input type="date" id="dob" name="dob" required />

                    <label htmlFor="nationality">Nationality:</label>
                    <input type="text" id="nationality" name="nationality" required />

                    <label htmlFor="job">Job:</label>
                    <input type="text" id="job" name="job" />
                  </>
                )}

                {role === 'tourGuide' && (
                  <>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required onChange={(e) => setEmailTourGuide(e.target.value)} />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />

                    <label htmlFor="mobile">Mobile Number:</label>
                    <input type="tel" id="mobile" name="mobile" required />

                    <label htmlFor="dob">Date of Birth:</label>
                    <input type="date" id="dob" name="dob" required />

                    <label htmlFor="nationality">Nationality:</label>
                    <input type="text" id="nationality" name="nationality" required />

                    <label htmlFor="experience">Years of Experience:</label>
                    <input type="number" id="experience" name="experience" required />

                    <label htmlFor="previousWork">Previous Work (if any):</label>
                    <input type="text" id="previousWork" name="previousWork" />
                  </>
                )}
                {role === 'admin' && (
                  <>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required onChange={(e) => setEmailTourGuide(e.target.value)} />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />

                    <label htmlFor="mobile">Mobile Number:</label>
                    <input type="tel" id="mobile" name="mobile" required />
                    
                  </>
                )}

                {/* Add forms for other roles like tourismGovernor, seller, admin,advertiser here */}

                <button type="submit" className="btn register-btn">Register</button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
