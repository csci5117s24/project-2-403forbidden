import React, { useState, useContext } from "react";
import DatePicker from 'react-datepicker'
import '../common/style.css';
import 'react-datepicker/dist/react-datepicker.css'
import UserInfoContext from '../UserInfoContext';
import { useLoaderData } from 'react-router-dom';
import MapImage from '../common/MapImage';
import RangeVisitItem from '../common/RangeVisitItem';
import { Link } from 'react-router-dom';
async function loader({ request }) {
  const allRangeVisits = await fetch("/api/rangevisits/all", {
      signal: request.signal,
      method: "GET",
      headers: {
        'userid': "",
      }
  });
  const rangevisits = await allRangeVisits.json();
  console.log(rangevisits);
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
  <div className="left-container">
    <div className="inputs-container">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        placeholderText="Your date of visit"
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
        <MapImage lat={lat} lng={lng}/>
      )}
    </div>
    <button className="add-visit-button" onClick={handleAddVisit}>
      Add new visit
    </button>
  </div>
  <div className="right-container">
    {/* Placeholder or additional content goes here */}
    <div className="grid-container">
    {allVisits.map((visit) => (
      <RangeVisitItem visit={visit} onDelete = {handleDelete}/>
    ))}
    </div>
  </div>
</div>
        
    );
}

export const Rangevisit_Add_Page = {
    path:"/rangevisit/add",
    element:<App></App>,
    loader:loader
  }