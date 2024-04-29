import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bulma/css/bulma.min.css'; 

const FirearmDetails = () => {
    const { firearmId } = useParams();
    const [firearm, setFirearm] = useState(null);
    const [rangeVisits, setRangeVisits] = useState([]);

    useEffect(() => {
        fetch(`/api/firearm/${firearmId}`)
            .then(response => response.json())
            .then(data => setFirearm(data))
            .catch(error => console.error('Error fetching firearm details:', error));

        fetch(`/api/firearm/${firearmId}/rangevisit`)
            .then(response => response.json())
            .then(data => setRangeVisits(data))
            .catch(error => console.error('Error fetching range visits:', error));
    }, [firearmId]);

    return (
        <div>
            <h1 className="title">Firearm Details</h1>
            <div className="box">
                {firearm ? (
                    <div className="card">
                        <div className="card-image">
                            <figure className="image is-4by3">
                                <img src={firearm.firearmImage} alt={`Firearm ${firearm.firearmName}`} />
                            </figure>
                        </div>
                        <div className="card-content">
                            <p className="title is-4">{firearm.firearmName}</p>
                            <p className="subtitle is-6">
                                Type: {firearm.firearmType}<br/>
                                Make: {firearm.firearmMake}<br/>
                                Model: {firearm.firearmModel}<br/>
                                Caliber: {firearm.firearmCaliber}<br/>
                                Price: ${firearm.firearmPrice}<br/>
                                Purchase Date: {firearm.firearmPurchasedate}
                            </p>
                        </div>
                    </div>
                ) : <p>Loading firearm details...</p>}
            </div>

            <h2 className="title">Maintenance History</h2>
            <div className="box">
                {firearm && firearm.firearmMaintenanceHistory && firearm.firearmMaintenanceHistory.length ? (
                    <ul>
                        {firearm.firearmMaintenanceHistory.map((item, index) => (
                            <li key={index}>
                                Date: {item.date}, Description: {item.description}
                            </li>
                        ))}
                    </ul>
                ) : <p>No maintenance history available.</p>}
            </div>

            <h2 className="title">Range Visits</h2>
            <div className="box">
                {rangeVisits.length ? (
                    <ul>
                        {rangeVisits.map(visit => (
                            <li key={visit._id}>
                                Date: {visit.visitDate}, Duration: {visit.duration} minutes
                            </li>
                        ))}
                    </ul>
                ) : <p>No range visits recorded.</p>}
            </div>
        </div>
    );
};

export const Firearm_Details_Page={
    path: '/firearm/:firearmId',
    element: <FirearmDetails />,
}
