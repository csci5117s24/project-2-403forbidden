import React, { useState, useContext } from "react";
import DatePicker from 'react-datepicker'
import '../common/style.css';
import 'react-datepicker/dist/react-datepicker.css'
import UserInfoContext from '../UserInfoContext';
import { useLoaderData } from 'react-router-dom';
import MapImage from '../common/MapImage';
import RangeVisitItem from '../common/RangeVisitItem';
import addNotification from 'react-push-notification';

async function loader({ request }) {
  const allRangeVisits = await fetch("/api/rangevisits/all", {
      signal: request.signal,
      method: "GET",
      headers: {
        'userid': "",
      }
  });
  const rangevisits = await allRangeVisits.json();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset the time to midnight for comparison

  // Filter and sort range visits
  const upcomingVisits = rangevisits.data
    .filter(visit => {
      // Parse visit date and check if it's after today's date
      const visitDate = new Date(visit.visitDate);
      return visitDate >= today; // Only future dates
    })
    .sort((a, b) => {
      // Sort by date (closest to today first)
      const dateA = new Date(a.visitDate);
      const dateB = new Date(b.visitDate);
      return dateA - dateB; // Ascending order (closest first)
    });

  // The first item is the visit closest to today
  const closestVisit = upcomingVisits[0];

  if (closestVisit){
    console.log("/rangevisit/" + closestVisit._id);
    addNotification({
      title: 'Your next scheduled range visit is coming!',
      message: 'click to see more details',
      duration: 5000,
      native: true,
      onClick: () => window.location = "/rangevisit/" + closestVisit._id,
    });
  } 

  
  return {rangevisits};
}

function App() {
    const {rangevisits} = useLoaderData();
    const [allVisits, setVisits] = useState(rangevisits.data);
    console.log(allVisits)
    const [selectedDate, setSelectedDate] = useState("");
    const userInfo = useContext(UserInfoContext);
    const handleDateChange = (date) => {
      setSelectedDate(date);
    }

    //Maybe later move to backend
    const [lat, setLat] = useState();
    const [lng, setLng] = useState();
    const [duration, setDuration] = useState(60);  // State for managing duration in minutes

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const handleDurationChange = (event) => {
      setDuration(event.target.value);  // Update duration based on user input
    };
  
    async function handleAddVisit() {
      const formattedDate = selectedDate.toISOString();
      const newRangeVisit = {
        date: formattedDate, 
        lat: lat, 
        lng: lng, 
        userID: userInfo.userId,
        duration:duration,
        detail: []
      }

      const result = await fetch("/api/rangevisit/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newRangeVisit)
      })
      if (result.ok) {
        const newlyAddedRangeVisit = await result.json();
        if (allVisits){
          setVisits([newlyAddedRangeVisit, ...allVisits]);
        } else {
          setVisits([newlyAddedRangeVisit]);
        }
        addNotification({
          title: 'A new range visit has been created',
          message: 'click to add details',
          duration: 5000,
          native: true,
          onClick: () => window.location = "/rangevisit/" + newlyAddedRangeVisit._id,
        });
      }
    };

    async function handleDelete(id){
      console.log("Delete");
      console.log(id);
      await fetch("/api/rangevisit/delete/"+id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
      })
      setVisits(allVisits.filter(visit => visit._id !== id));
    };

    function success(pos) {
      const crd = pos.coords;
      setLat(crd.latitude);
      setLng(crd.longitude);

      
      console.log("Your current position is:");
      console.log(lat);
      console.log(lng);
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
    }
    
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    if (!lat || !lng) {
      navigator.geolocation.getCurrentPosition(success, error, options);
    }

    return (
      <div className="main-container">
  {/* Semi-transparent background image overlay */}
  <div className="main-background-overlay"></div>

  <div className="left-container">
    <div className="inputs-container">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        placeholderText="Your date of visit"
        className="custom-datepicker"
      />
      <div className="duration-container">
        <input
          type="number"
          value={duration}
          onChange={handleDurationChange}
          placeholder="Duration in minutes"
          className="duration-input"
        />
        <span className="duration-label">min</span>
      </div>
    </div>
    <div className="map-container">
      {!lat || !lng ? (
        <h1>Loading...</h1>
      ) : (
        <MapImage lat={lat} lng={lng} />
      )}
    </div>
    <button className="add-visit-button" onClick={handleAddVisit}>
      Add new visit
    </button>
  </div>

  {allVisits.length > 0 && (
    <div className="right-container">
      <div className="grid-container">
        {allVisits.sort((a, b) => {
          // Convert visit dates to Date objects for accurate comparison
          const dateA = new Date(a.visitDate);
          const dateB = new Date(b.visitDate);
          return dateB - dateA; // Ascending order (oldest to newest)
          // return dateB - dateA; // For descending order (newest to oldest)
        })
        .map((visit, index) => (
                <RangeVisitItem key={index} visit={visit} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}
      </div>
        
    );
}

export const Rangevisit_Add_Page = {
    path:"/rangevisit/add",
    element:<App></App>,
    loader:loader
  }