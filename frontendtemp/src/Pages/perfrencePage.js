import React from 'react';
import PreferenceChoose from '../Components/Preference'; // Adjust the path if necessary
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const PreferencePage = () => {
    return (
        <div>
             <Navbar/>
            <PreferenceChoose />
            
        </div>
    );
};

export default PreferencePage;
