import React, { useState } from 'react';
import './styles/global.css';
import TouristPage from './Pages/TouristPage';
import AdvertiserPage from './Pages/AdvertiserPage'; 
import TourismGovernerPage from './Pages/TourismGovernerPage'; 
import { 
  registerTourist, 
  fetchTouristByEmail 
} from './RequestSendingMethods';

function App() {
  const [action, setAction] = useState('');
  const [registrationType, setRegistrationType] = useState('');
  const [role, setRole] = useState('');
  const [step, setStep] = useState(1);
  const [isTouristPageActive, setIsTouristPageActive] = useState(false);
  const [isAdvertiserPageActive, setIsAdvertiserPageActive] = useState(false);
  const [isTourismGovernerPageActive, setTourismGovernerPageActive] = useState(false);
  const [emailagain, setEmail] = useState('');

  const handleActionSelection = (selectedAction) => {
    setAction(selectedAction);
  };

  const handleProceed = (event) => {
    event.preventDefault();
    setStep(2);
  };

  const handleRegister = async (event) => {
    console.log("Register button clicked");
    event.preventDefault();
    const formElements = event.target.elements;

    if (role === 'tourist') {
      let touristData = {
        name: event.target.username.value,
        email: event.target.email.value,
        password: event.target.password.value,
        mobile: event.target.mobile.value,
        dob: event.target.dob.value,
        nationality: event.target.nationality.value,
        job: event.target.job.value,
      };

      setIsTouristPageActive(true);
      await registerTourist(touristData);
    }

    if (role === 'advertiser') {
      setIsAdvertiserPageActive(true);
    }

    if (role === 'tourismGovernor') {
      setTourismGovernerPageActive(true);
    } else {
      console.log(`Role selected: ${role}`);
    }
  };

  return (
    <div className="container">
      {isTouristPageActive ? (
        <TouristPage email={emailagain} />
      ) : isAdvertiserPageActive ? (
        <AdvertiserPage />
      ) : isTourismGovernerPageActive ? (
        <TourismGovernerPage />
      ) : (
        <>
          {action === '' && (
            <div className="welcome-message">
              <h1>Welcome to the Very Good Travel App</h1>
              <p>Please select an action:</p>
              <button onClick={() => handleActionSelection('register')}>Register</button>
              <button onClick={() => handleActionSelection('signin')}>Sign In</button>
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

                {/* Add forms for other roles like seller, advertiser, tourismGovernor here */}
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