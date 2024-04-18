export default function MapImage({lat, lng}) {
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;  // Access the API key from environment variables
    const size = "600x300";
    const zoom = 13;
    const maptype = "roadmap";
    const centerCoords = `${lat},${lng}`;
    const marker = `color:blue|${centerCoords}`;
  
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerCoords}&zoom=${zoom}&size=${size}&maptype=${maptype}&markers=${marker}&key=${apiKey}`;
  
    return (
        <img src={mapUrl} alt="Dynamic Map" />
    );
  }