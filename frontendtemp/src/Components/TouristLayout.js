import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';  // Assuming the Navbar component is in the same folder

const TouristLayout = ({ email }) => {
  return (
    <div>
      <Navbar email={email} />
      <div className="tourist-content">
        <Outlet /> {/* This will render the content for the current route */}
      </div>
    </div>
  );
};

export default TouristLayout;
