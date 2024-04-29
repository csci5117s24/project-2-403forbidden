import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Define the loader function here if it's being used to pre-load data
const loader = async ({ params }) => {
    const response = await fetch(`/api/firearm/${params.id}`);
    const data = await response.json();
    return { firearm: data };
};

const FirearmDetail = () => {
    const { id: firearmId } = useParams();
    const [firearm, setFirearm] = useState(null);
    const [error, setError] = useState('');
  

    // Fetch the firearm details when the component mounts or the firearmId changes
    useEffect(() => {
        console.log("Firearm ID:", firearmId);  // This will log the firearm ID being used in the fetch call

        const fetchFirearmDetails = async () => {
            try {
                const response = await fetch(`/api/firearm/${firearmId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch firearm details');
                }
                const data = await response.json();
                setFirearm(data); // Set the firearm data into state
            } catch (error) {
                setError(error.message);
            }
        };

        fetchFirearmDetails();
    }, [firearmId]);

    if (error) {
        return <p className="notification is-danger">Error: {error}</p>;
    }

    if (!firearm) {
        return <p>Loading...</p>; // Show a loading message while the data is being fetched
    }

    // Function to render the range visit history
    const renderRangeVisitHistory = () => {
        return firearm.firearmRangeVisitHistory.length > 0 ? (
            <ul>
                {firearm.firearmRangeVisitHistory.map((visit, index) => (
                    <li key={index}>{visit.date} - {visit.location} - {visit.notes}</li>
                ))}
            </ul>
        ) : (
            <p>No range visits recorded.</p>
        );
    };

    // Function to render the maintenance history
    const renderMaintenanceHistory = () => {
        return firearm.firearmMaintenanceHistory.length > 0 ? (
            <ul>
                {firearm.firearmMaintenanceHistory.map((record, index) => (
                    <li key={index}>{record.date} - {record.action}</li>
                ))}
            </ul>
        ) : (
            <p>No maintenance records.</p>
        );
    };

    return (
        <div>
            <h1>Firearm Detail - {firearm.firearmName}</h1>

            <h2>Stats</h2>
            <p>Model: {firearm.firearmModel}</p>
            <p>Type: {firearm.firearmType}</p>
            <p>Caliber: {firearm.firearmCaliber}</p>
            {/* Add more stats as needed */}

            <h2>Range Visit History</h2>
            {renderRangeVisitHistory()}

            <h2>Maintenance History</h2>
            {renderMaintenanceHistory()}
        </div>
    );
};

export const Firearm_Detail_Page = {
    path: "/firearmDetail/:id",
    element: <FirearmDetail />,
    loader:loader
  };
