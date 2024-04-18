import React, { useState, useContext } from "react";
import '../common/style.css';
import 'react-datepicker/dist/react-datepicker.css'
import { useLoaderData } from 'react-router-dom';
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
    console.log(rangevisit);

    const [visitDate, setVisitDate] = useState(rangevisit.visitDate);
    const [visitDuration, setVisitDuration] = useState(rangevisit.duration);
    const [visitLat, setVisitLat] = useState(rangevisit.rangeLat);
    const [visitLng, setVisitLng] = useState(rangevisit.rangeLng);
    const [visitDetail, setVisitDetail] = useState(rangevisit.visitDetail)

    
    return (
      <div className="main-container">
      </div>
        
    );
}

export const Rangevisit_Detail_Page = {
    path:"/rangevisit/:id",
    element:<App></App>,
    loader:loader
  }