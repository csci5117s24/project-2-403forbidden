import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bulma/css/bulma.min.css'; 

function EditMaintenance() {
    const { id } = useParams();  
    const navigate = useNavigate();
    const [maintenance, setMaintenance] = useState({
        date: '',
        description: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMaintenance = async () => {
            try {
                const response = await fetch(`/api/firearm/maintenance/latest/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch maintenance details');
                }
                const data = await response.json();
                if (data.latestMaintenance) {
                    setMaintenance({
                        date: data.latestMaintenance.date,
                        description: data.latestMaintenance.description
                    });
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchMaintenance();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/firearm/maintenance/editLast/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(maintenance)
            });
            if (!response.ok) {
                throw new Error('Failed to update maintenance record');
            }
            alert('Maintenance updated successfully');
            navigate(-1); // 返回之前的页面
        } catch (error) {
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        setMaintenance({
            ...maintenance,
            [e.target.name]: e.target.value
        });
    };

    if (error) {
        return <div className="notification is-danger">Error: {error}</div>;
    }

    return (
        <div className="container">
            <div className="section">
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="label" htmlFor="date">Date</label>
                        <div className="control">
                            <input
                                className="input"
                                type="date"
                                id="date"
                                name="date"
                                value={maintenance.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="description">Description</label>
                        <div className="control">
                            <textarea
                                className="textarea"
                                id="description"
                                name="description"
                                value={maintenance.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="control">
                        <button type="submit" className="button is-link">Update Maintenance</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditMaintenance;
