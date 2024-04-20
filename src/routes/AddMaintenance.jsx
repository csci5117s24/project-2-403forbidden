import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css'; // Ensure Bulma CSS is imported

function AddMaintenance() {
    const [firearms, setFirearms] = useState([]);
    const [selectedFirearmId, setSelectedFirearmId] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLoading(true);
        fetch('/api/firearm')  
            .then(response => response.json())
            .then(data => {
                setFirearms(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch firearms');
                setIsLoading(false);
                console.error('Error fetching firearms:', err);
            });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const maintenanceRecord = {
            date,
            description
        };

        const response = await fetch(`/api/firearm/maintenance/${selectedFirearmId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(maintenanceRecord)
        });

        if (!response.ok) {
            setError('Failed to add maintenance record');
            console.error('Failed to add maintenance:', await response.text());
        } else {
            alert('Maintenance record added successfully!');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="title">Add Maintenance Record</h1>
            {isLoading && <div className="notification is-primary">Loading...</div>}
            {error && <div className="notification is-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label className="label">Firearm</label>
                    <div className="control">
                        <div className="select is-fullwidth">
                            <select value={selectedFirearmId} onChange={e => setSelectedFirearmId(e.target.value)} required>
                                <option value="">Select a Firearm</option>
                                {firearms.map(firearm => (
                                    <option key={firearm._id} value={firearm._id}>
                                        {firearm.firearmName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Date</label>
                    <div className="control">
                        <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Description</label>
                    <div className="control">
                        <textarea className="textarea" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button type="submit" className="button is-link">Add Maintenance</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddMaintenance;
