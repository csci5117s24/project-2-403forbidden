import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FirearmMaintenanceCard from './FirearmMaintenanceCard';
import 'bulma/css/bulma.min.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function DetailMaintenance() {
    const { firearmId } = useParams(); 
    const navigate = useNavigate();
    const [firearm, setFirearm] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFirearmById = async () => {
            try {
                const response = await fetch(`/api/firearm/${firearmId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch firearm details');
                }
                const data = await response.json();
                setFirearm(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchFirearmById();
    }, [firearmId]);

    const handleDelete = async () => {
        const response = await fetch(`/api/firearm/maintenance/deleteLast/${firearmId}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Maintenance record deleted successfully.');
            navigate('/firearm_maintenance');
        } else {
            setError('Failed to delete maintenance record');
        }
    };

    if (!firearm) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="notification is-danger">Error: {error}</p>;
    }

    return (
        <div className="container">
            <FirearmMaintenanceCard firearm={firearm} />

            <div className="buttons is-pulled-right" style={{ position: 'fixed', bottom: 20, right: 20 }}>
            <button onClick={() => navigate(`/editMaintenance/${firearmId}`)} className="button is-info">
                    <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button onClick={handleDelete} className="button is-danger">
                    <FontAwesomeIcon icon={faTrashAlt} /> Delete
                </button>
            </div>
        </div>        

    );
}

export default DetailMaintenance;
