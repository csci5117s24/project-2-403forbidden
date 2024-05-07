import React, { useState, useEffect } from 'react';

export default function MapImageSummary({ coordinates }) {
  // State to store the fetched API key
  const [apiKey, setApiKey] = useState('');
  const size = '300x300';
  const zoom = 4; // Adjust zoom to cover the required area
  const maptype = 'roadmap';
  const americaCenterCoords = '39.8283,-98.5795'; // Center of the continental US

  // Fetch the API key from the backend API
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/googlemapkey'); // Adjust the route if necessary
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

  // Construct the markers string by combining all coordinates
  const markers = coordinates
    .map(({ lat, lng }) => `color:blue|${lat},${lng}`)
    .join('|');

  // Build the Google Static Maps URL with multiple markers using the fetched API key
  const mapUrl = apiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${americaCenterCoords}&zoom=${zoom}&size=${size}&maptype=${maptype}&markers=${markers}&key=${apiKey}`
    : '';

  return (
    <div>
      {/* Display the map only when the API key has been successfully fetched */}
      {apiKey ? (
        <img src={mapUrl} alt="Map with Multiple Markers" />
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
}
