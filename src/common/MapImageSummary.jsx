export default function MapImageSummary({ coordinates }) {
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY; // Access the API key from environment variables
    const size = "300x300";
    const zoom = 4; // Adjust zoom to cover the required area
    const maptype = "roadmap";
    const americaCenterCoords = "39.8283,-98.5795"; // Center of the continental US
    
    // Construct the markers string by combining all coordinates
    const markers = coordinates
      .map(({ lat, lng }) => `color:blue|${lat},${lng}`)
      .join("|");
    
    // Build the Google Static Maps URL with multiple markers
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${americaCenterCoords}&zoom=${zoom}&size=${size}&maptype=${maptype}&markers=${markers}&key=${apiKey}`;
    
    return (
      <img src={mapUrl} alt="Map with Multiple Markers" />
    );
  }