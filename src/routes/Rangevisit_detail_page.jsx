import React, { useState, useContext } from "react";
import '../common/style.css';
import 'react-datepicker/dist/react-datepicker.css'
import { useLoaderData } from 'react-router-dom';
import MapImage from '../common/MapImage';
import moment from 'moment';
import AddItemForm from "../common/AddRangeVisitItem";
async function loader({ request, params }) {
  const { id } = params;
  const rangevisitRequest = await fetch("/api/rangevisit/"+id, {
    signal: request.signal,
    method: "GET",
  });

  const rangevisit = await rangevisitRequest.json();
  console.log(rangevisit);
  return rangevisit;
}



function App() {
    const {rangevisit} = useLoaderData();

    const [visitDate, setVisitDate] = useState(rangevisit.visitDate);
    const [visitDuration, setVisitDuration] = useState(rangevisit.duration);
    const [visitLat, setVisitLat] = useState(rangevisit.rangeLat);
    const [visitLng, setVisitLng] = useState(rangevisit.rangeLng);
    const [visitDetail, setVisitDetail] = useState(rangevisit.visitDetail)

    const handleSubmit = (firearm, value) => {
        const newDetail = {
            firearm: firearm,
            value: value
        };
        setVisitDetail([...visitDetail, newDetail]);
    };

    return (
      <div className="vertical-grid">
        <div className="visit-item">
          <div className="info-container">
              <p className="date">{moment(visitDate).format('YYYY-MM-DD')}</p>
              <p className="duration">{visitDuration} min</p>
          </div>
          <div className="map-container">
            <MapImage lat={visitLat} lng={visitLng}/>
          </div>
        </div>
        <AddItemForm handleSubmit={handleSubmit}></AddItemForm>
        <div className="detail-list">
            {visitDetail.map((detail, index) => (
                <div key={index} className="detail-item">
                    <span className="firearm">{detail.firearm}</span>
                    <span className="value">{detail.value}</span>
                </div>
            ))}
        </div>

      </div>
      
        
    );
}

export const Rangevisit_Detail_Page = {
    path:"/rangevisit/:id",
    element:<App></App>,
    loader:loader
  }