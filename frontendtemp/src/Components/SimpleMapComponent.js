import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';

const SimpleMapComponent = ({ location }) => {
    
    // State to hold the marker's positio

    return ( 
        <div    style={{  display: 'grid', 
            placeItems: 'center', 
            height: '60vh', 
            width: '100%', 
            position: 'relative' 
          }} >
        <GoogleMap
            id="map"
            mapContainerStyle={{ height: '400px', width: '800px' }}
            center={location} // Center on markerPosition or initialCenter
            zoom={10} // Adjust zoom level as needed
        >
            
            <MarkerF position={{location}} />
        </GoogleMap>
        </div>
    );
};

export default SimpleMapComponent;
