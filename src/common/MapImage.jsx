import React, { useState, useEffect } from 'react';

export default function MapImage({ lat, lng }) {
  // State to hold the fetched API key
  const [apiKey, setApiKey] = useState('');
  const size = '600x300';
  const zoom = 13;
  const maptype = 'roadmap';
  const centerCoords = `${lat},${lng}`;
  const marker = `color:blue|${centerCoords}`;

  // Fetch the API key from the backend API
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/googlemapkey'); // Adjust the route if needed
        const data = await response.json();
        if (data && data.key) {
          setApiKey(data.key); // Store the fetched key in the state
        }
      } catch (error) {
        console.error('Error fetching the Google Maps API key:', error);
      }
    };

    fetchApiKey(); // Fetch the API key when the component mounts
  }, []);

  // Construct the map URL dynamically using the fetched API key
  const mapUrl = apiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${centerCoords}&zoom=${zoom}&size=${size}&maptype=${maptype}&markers=${marker}&key=${apiKey}`
    : '';

  return (
    <div>
      {/* Check if the API key has been loaded before displaying the map */}
      {apiKey ? (
        <img src={mapUrl} alt="Dynamic Map" />
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
}