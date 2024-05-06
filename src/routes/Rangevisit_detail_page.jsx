import React, { useState, useContext } from "react";
import DatePicker from 'react-datepicker'
import '../common/style.css';
import 'react-datepicker/dist/react-datepicker.css'
import { useLoaderData } from 'react-router-dom';
import MapImage from '../common/MapImage';
import moment from 'moment';
import AddItemForm from "../common/AddRangeVisitItem";
import { v4 as uuidv4 } from 'uuid'; 
import { Link } from 'react-router-dom';
async function loader({ request, params }) {
  const { id } = params;
  const rangevisitRequest = fetch("/api/rangevisit/"+id, {
    signal: request.signal,
    method: "GET",
  });

  const firearmsRequest = fetch("/api/firearm", {
    signal: request.signal,
    method: "GET",
    headers: {
      'userid': "",
    }
  });

  const [result1, result2] = await Promise.all([rangevisitRequest, firearmsRequest]);
  if (result1.ok && result2.ok) {
    const [rangevisitdata, firearmsdata] = await Promise.all([result1.json(), result2.json()]);
    console.log({rangevisitdata, firearmsdata})
    return {rangevisitdata, firearmsdata}
  } else {
  // this is just going to trigger the 404 page, but we can fix that later :|
  throw new Response("ERROR");
  }
}



function App() {
    const {rangevisitdata, firearmsdata} = useLoaderData();
    console.log(firearmsdata);
    const [rangevisit, setRangevisit] = useState(rangevisitdata.rangevisit)
    const [visitDate, setVisitDate] = useState(new Date(rangevisit.visitDate) || new Date());
    const [visitDuration, setVisitDuration] = useState(rangevisit.duration);
    const [visitLat, setVisitLat] = useState(rangevisit.rangeLat);
    const [visitLng, setVisitLng] = useState(rangevisit.rangeLng);
    const [visitDetail, setVisitDetail] = useState(rangevisit.visitDetail)
    async function handleSubmit(firearm, value){
        const newDetail = {
            firearm: firearm,
            value: value,
            id: uuidv4(),
        };
        console.log(newDetail.id);
        const updatedVisitDetails = [...visitDetail, newDetail];
        setVisitDetail(updatedVisitDetails); 
        // Use the updated array for the PUT request
        const updateRangeVisit = {
          detail: updatedVisitDetails
        };
        console.log(rangevisit._id);
        console.log(updatedVisitDetails);

        

        await fetch("/api/rangevisit/update/"+rangevisit._id, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(updateRangeVisit)
      })

    };

    async function handleDelete(id) {
      // Filter out the item with the given id
      const updatedVisitDetails = visitDetail.filter(detail => detail.id !== id);
      setVisitDetail(updatedVisitDetails); 
      const updateRangeVisit = {
        detail: updatedVisitDetails
      };
      console.log(rangevisit._id);
      console.log(updatedVisitDetails);

      

      await fetch("/api/rangevisit/update/"+rangevisit._id, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(updateRangeVisit)
      })
    }

    const [isEditing, setIsEditing] = useState(false);

    const toggleEditMode = () => {
      setIsEditing(!isEditing);
    };

    const cancelEdit = () => {
      console.log("Cancel update");
      setVisitDate(new Date(rangevisit.visitDate))
      setVisitDuration(rangevisit.duration);
      setVisitLat(rangevisit.rangeLat);
      setVisitLng(rangevisit.rangeLng);
      setIsEditing(!isEditing);
    };

    async function confirmEdit(){
      console.log("Confirm update");
      const formattedDate = visitDate.toISOString();
      const updateRangeVisit = {
        date: formattedDate, 
        lat: visitLat, 
        lng: visitLng, 
        duration:visitDuration,
      };

      const result = await fetch("/api/rangevisit/update/"+rangevisit._id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updateRangeVisit)
      })

      if (result.ok) {
        const rangevisitRequest = await fetch("/api/rangevisit/"+rangevisit._id, {
          method: "GET",
        });
        const newRangeVisit = await rangevisitRequest.json();
        console.log(newRangeVisit);
        setRangevisit(newRangeVisit.rangevisit);
      }
      setIsEditing(!isEditing);
    };

    const handleDateChange = (date) => {
      setVisitDate(date);
    }

    const handleDurationChange = (event) => {
      setVisitDuration(event.target.value);  // Update duration based on user input
    };

    async function updateLocation(){
      console.log("Update geolocation begin");
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      function success(pos) {
        const crd = pos.coords;
        console.log(visitLat);
        console.log(visitLng);
        setVisitLat(crd.latitude);
        setVisitLng(crd.longitude);
        console.log("Your new position is:");
        console.log(visitLat);
        console.log(visitLng);
      }
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      navigator.geolocation.getCurrentPosition(success, error, options);
      const updateRangeVisit = {
        lat: visitLat, 
        lng: visitLng, 
      };

      const result = await fetch("/api/rangevisit/update/"+rangevisit._id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updateRangeVisit)
      })

      if (result.ok) {
        const rangevisitRequest = await fetch("/api/rangevisit/"+rangevisit._id, {
          method: "GET",
        });
        const newRangeVisit = await rangevisitRequest.json();
        console.log(newRangeVisit);
        setRangevisit(newRangeVisit.rangevisit);
      }
    }
    const confirmAndUpdateLocation = () => {
      // Show the confirmation dialog
      const userConfirmed = window.confirm(
        "Are you sure you want to update your geolocation for this range visit?"
      );
  
      // Proceed only if the user confirms
      if (userConfirmed) {
        updateLocation();
      }
    };

    return (
      <div className="vertical-grid">
        {/* Semi-transparent background image overlay */}
        <div className="vertical-grid-background-overlay"></div>

        {/* Visit item */}
        <div className="visit-item">
        {isEditing ? (
        <div className="inputs-container">
          <DatePicker
            selected={visitDate}
            onChange={handleDateChange}
            placeholderText="Your date of visit"
            className="custom-datepicker"
          />
          <div className="duration-container">
            <input
              type="number"
              value={visitDuration}
              onChange={handleDurationChange}
              placeholder="Duration in minutes"
              className="duration-input"
            />
            <span className="duration-label">min</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="info-container">
            <p className="date">{moment(visitDate).format('YYYY-MM-DD')}</p>
            <p className="duration">{visitDuration} min</p>
          </div>
          <div className="map-container">
            <MapImage lat={visitLat} lng={visitLng} />
          </div>
        </div>
      )}
          {isEditing  && <button className="button is-primary" onClick={cancelEdit}>
            Cancel
          </button>}
          {isEditing  && <button className="button is-primary" onClick={confirmEdit}>
            Update
          </button>}
          {!isEditing  && <button className="button is-primary" onClick={toggleEditMode}>
            Edit Visit
          </button>}
          {!isEditing  && <button className="button is-primary" onClick={confirmAndUpdateLocation}>
            Update Location
          </button>}
          {!isEditing  && <AddItemForm handleSubmit={handleSubmit} firearmlist={firearmsdata}></AddItemForm>}
        </div>

        

        {/* Detail list */}
        {visitDetail.length > 0 && (
          <div className="detail-list">
          {visitDetail.map((detail, index) => {
            const firearm = firearmsdata.find(f => f._id === detail.firearm);
            const handleButtonClick = (e) => {
              e.stopPropagation(); // Prevent the event from bubbling up to the Link
              handleDelete(detail.id); // Proceed with the deletion
            };
            return (
                <div key={detail.id} className="detail-item">
                  <button
                    className="range-visit-detail-delete-button"
                    onClick={handleButtonClick}
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                  <span className="firearm">{firearm ? firearm.firearmName : 'Unknown Firearm'}</span>
                  <span className="value">{detail.value}</span>
                </div>       
            );
          })}
        </div>
        )}
        
      </div>
      
        
    );
}

export const Rangevisit_Detail_Page = {
    path:"/rangevisit/:id",
    element:<App></App>,
    loader:loader
  }