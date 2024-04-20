import React, { useState, useEffect } from "react";
import 'bulma/css/bulma.min.css';
import { useNavigate } from 'react-router-dom'; // 导入 useHistory
import FirearmMaintenanceCard from "./FirearmMaintenanceCard.jsx";

function FirearmMaintenanceInventory() {
    const [firearms, setFirearms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFirearmsWithMaintenance = async () => {
            const response = await fetch('/api/firearms/maintenance');
            const data = await response.json();
            console.log("API data:", data);
            setFirearms(data);
        };

        fetchFirearmsWithMaintenance();
    }, []);

    const navigateToMaintenance = () => {
        navigate('/addMaintenance'); // Updated navigation method
    };

    return (
        <div className="container">
            <div className="columns is-multiline">
                {firearms.map(firearm => (
                    <div className="column is-one-third" key={firearm._id}>
                        <FirearmMaintenanceCard firearm={firearm} />
                    </div>
                ))}
            </div>
            <button className="button is-primary" onClick={navigateToMaintenance}>Add Maintenance</button> {/* Correct function called here */}
        </div>
    );
}

export default FirearmMaintenanceInventory;
