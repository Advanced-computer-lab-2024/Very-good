import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './styles/global.css';
import TouristPage from './Pages/TouristPage';
import AdminPage from './Pages/AdminPagee';
import AdvertiserPage from './Pages/AdvertiserPage';
import TourismGovernerPage from './Pages/TourismGovernerPage';
import TourGuideHomePage from './Pages/tourGuideHomePage';
import SellerPage from './Pages/SellerPage';
import GuestPage from './Pages/GuestPage';
import { registerTourist, createTourGuideRequest, registerSeller, registerAdvertiser } from './RequestSendingMethods';
import { LoadScript } from '@react-google-maps/api';

function App() {
  const [action, setAction] = useState(''); // Tracks the user's action (register or sign in)
  const [registrationType, setRegistrationType] = useState(''); // Tracks if user is individual or organization
  const [role, setRole] = useState(''); // Tracks the selected role
  const [step, setStep] = useState(1); // Tracks if we're on the initial or detailed form
  const [emailagain, setEmail] = useState(''); // Holds the tourist email
  const [emailtourguide, setEmailTourGuide] = useState(''); // Holds the tour guide email
  const [emailofseller, setEmailOfSeller] = useState(''); // Holds seller email
  const [emailAdvertiser, setEmailOfAdvertiser] = useState(''); // Holds advertiser email
  const navigate = useNavigate(); // To programmatically navigate

  const handleActionSelection = (selectedAction) => {
    setAction(selectedAction);
  };

  const handleProceed = (event) => {
    event.preventDefault();
    setStep(2); // Move to step 2
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const formElements = event.target.elements;

    // Handle tourist registration
    if (role === 'tourist') {
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
      navigate('/tourist');
    }

    if (role === 'tourGuide') {
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
      await createTourGuideRequest(tourGuideData);
      navigate('/tourGuide');
    }

    if (role === 'tourismGovernor') {
      navigate('/tourismGovernor');
    }

    if (role === 'seller') {
      let sellerData = {
        name: formElements.username.value,
        email: formElements.email.value,
        password: formElements.password.value,
        description: formElements.description.value,
      };
      await registerSeller(sellerData);
      navigate('/seller');
    }

    if (role === 'advertiser') {
      let advertiserData = {
        name: formElements.username.value,
        email: formElements.email.value,
        password: formElements.password.value,
        websiteLink: formElements.website.value,
        hotline: formElements.hotline.value,
        companyProfile: formElements.companyProfile.value,
      };
      await registerAdvertiser(advertiserData);
      navigate('/advertiser');
    }
  };

  const handleAdminSignIn = (event) => {
    // Add logic to handle admin sign in here
    navigate('/admin');
  };

  const handleGuest = () => {
    navigate('/guest');
  };

  return (
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Welcome Message and Action Selection */}
                {action === '' && (
                  <div className="welcome-message">
                    <h1>Welcome to the Very Good Travel App</h1>
                    <p>Please select an action:</p>
                    <button onClick={() => handleActionSelection('register')}>Register</button>
                    <button onClick={() => handleAdminSignIn()}>Sign In as an Admin</button>
                    <button onClick={() => handleGuest()}>Continue as a Guest</button>
                  </div>
                )}

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

                          <label htmlFor="mobile">Mobile:</label>
                          <input type="tel" id="mobile" name="mobile" required />

                          <label htmlFor="dob">Date of Birth:</label>
                          <input type="date" id="dob" name="dob" required />

                          <label htmlFor="nationality">Nationality:</label>
                          <input type="text" id="nationality" name="nationality" required />

                          <label htmlFor="job">Job:</label>
                          <input type="text" id="job" name="job" required />

                          <button type="submit" className="btn">Register</button>
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

                          <label htmlFor="mobile">Mobile:</label>
                          <input type="tel" id="mobile" name="mobile" required />

                          <label htmlFor="dob">Date of Birth:</label>
                          <input type="date" id="dob" name="dob" required />

                          <label htmlFor="nationality">Nationality:</label>
                          <input type="text" id="nationality" name="nationality" required />

                          <label htmlFor="experience">Years of Experience:</label>
                          <input type="number" id="experience" name="experience" required />

                          <label htmlFor="previousWork">Previous Job:</label>
                          <input type="text" id="previousWork" name="previousWork" required />

                          <button type="submit" className="btn">Register</button>
                        </>
                      )}

                      {role === 'tourismGovernor' && (
                        <>
                          <label htmlFor="username">Username:</label>
                          <input type="text" id="username" name="username" required />

                          <label htmlFor="email">Email:</label>
                          <input type="email" id="email" name="email" required />

                          <label htmlFor="password">Password:</label>
                          <input type="password" id="password" name="password" required />

                          <label htmlFor="nationality">Nationality:</label>
                          <input type="text" id="nationality" name="nationality" required />

                          <button type="submit" className="btn">Register</button>
                        </>
                      )}

                      {role === 'seller' && (
                        <>
                          <label htmlFor="username">Username:</label>
                          <input type="text" id="username" name="username" required />

                          <label htmlFor="email">Email:</label>
                          <input type="email" id="email" name="email" required onChange={(e) => setEmailOfSeller(e.target.value)} />

                          <label htmlFor="password">Password:</label>
                          <input type="password" id="password" name="password" required />

                          <label htmlFor="description">Business Description:</label>
                          <textarea id="description" name="description" required />

                          <button type="submit" className="btn">Register</button>
                        </>
                      )}

                      {role === 'advertiser' && (
                        <>
                          <label htmlFor="username">Username:</label>
                          <input type="text" id="username" name="username" required />

                          <label htmlFor="email">Email:</label>
                          <input type="email" id="email" name="email" required onChange={(e) => setEmailOfAdvertiser(e.target.value)} />

                          <label htmlFor="password">Password:</label>
                          <input type="password" id="password" name="password" required />

                          <label htmlFor="website">Website Link:</label>
                          <input type="url" id="website" name="website" required />

                          <label htmlFor="hotline">Hotline:</label>
                          <input type="tel" id="hotline" name="hotline" required />

                          <label htmlFor="companyProfile">Company Profile:</label>
                          <textarea id="companyProfile" name="companyProfile" required />

                          <button type="submit" className="btn">Register</button>
                        </>
                      )}
                    </form>
                  </div>
                )}
              </>
            }
          />
          <Route path="/tourist" element={<TouristPage email={emailagain}/>} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/advertiser" element={<LoadScript googleMapsApiKey='AIzaSyAbrhlteb_a1DkS0Jp1tU9fLD5Hi-j2CrA'> <AdvertiserPage email={emailAdvertiser}/> </LoadScript>} />
          <Route path="/tourismGovernor" element={<TourismGovernerPage />} />
          <Route path="/tourGuide" element={<TourGuideHomePage email={emailtourguide}/>} />
          <Route path="/seller" element={<SellerPage email={emailofseller}/>} />
          <Route path="/guest" element={<GuestPage />} />
        </Routes>
      </div>
  );
}

export default App;
