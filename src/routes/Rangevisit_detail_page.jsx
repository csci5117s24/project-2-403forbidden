import React, { useState, useContext } from "react";
import '../common/style.css';
import 'react-datepicker/dist/react-datepicker.css'
import { useLoaderData } from 'react-router-dom';
import MapImage from '../common/MapImage';
import moment from 'moment';
import AddItemForm from "../common/AddRangeVisitItem";
import { v4 as uuidv4 } from 'uuid'; 
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
    const [visitDate, setVisitDate] = useState(rangevisit.visitDate);
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

    return (
      <div className="vertical-grid">
        {/* Semi-transparent background image overlay */}
        <div className="vertical-grid-background-overlay"></div>

        {/* Visit item */}
        <div className="visit-item">
          <div className="info-container">
            <p className="date">{moment(visitDate).format('YYYY-MM-DD')}</p>
            <p className="duration">{visitDuration} min</p>
          </div>
          <div className="map-container">
            <MapImage lat={visitLat} lng={visitLng} />
          </div>
          <AddItemForm handleSubmit={handleSubmit} firearmlist={firearmsdata}></AddItemForm>
        </div>

        

        {/* Detail list */}
        {visitDetail.length > 0 && (
          <div className="detail-list">
          {visitDetail.map((detail, index) => {
            const firearm = firearmsdata.find(f => f._id === detail.firearm);

            return (
              <div key={detail.id} className="detail-item">
                <button
                  className="range-visit-detail-delete-button"
                  onClick={() => handleDelete(detail.id)}
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