import React, { useState } from 'react';
import './style.css'

export default function AddItemForm({ handleSubmit, firearmlist}) {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [firearm, setFirearm] = useState('');
    const [value, setValue] = useState('');

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
    };

    const handleInternalSubmit = (event) => {
        event.preventDefault();  // Prevent default if it was a form
        handleSubmit(firearm, value); // Call the passed handleSubmit with current state
        setIsFormVisible(false); // Optionally close form after submit
    };

    return (
        <div className="add-item">
            <button onClick={toggleFormVisibility}>
                {isFormVisible ? '-' : '+'}
            </button>
            {isFormVisible && (
                <div className="form-container">
                    <select required value={firearm} onChange={e => setFirearm(e.target.value)}>
                        <option value="">Select Firearm</option>
                        {firearmlist.map((firearm) => (
                        <option key={firearm._id} value={firearm._id} className='color7'>
                            {firearm.firearmName}
                        </option>
                        ))}
                    </select>
                    <input type="text" placeholder="Enter value" value={value} onChange={e => setValue(e.target.value)} required />
                    <div className="form-actions">
                        <button type="button" onClick={handleCancel}>Cancel</button>
                        <button type="button" onClick={handleInternalSubmit}>Add</button>
                    </div>
                </div>
            )}
        </div>
    );
}