import React, { useState } from 'react';
import './FirearmCard.css'; // Make sure the CSS is linked properly in your project

const FirearmCard = ({ firearm, onUpdate, onDelete }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedFirearm, setEditedFirearm] = useState({ ...firearm });
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedFirearm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleOnClick = () => {
        navigate(`/firearm/${firearm._id}`);
        
    };


    const saveChanges = () => {
      console.log(editedFirearm);
        onUpdate(editedFirearm);
        setEditMode(false);
    };

    const cancelChanges = () => {
        setEditedFirearm({ ...firearm });
        setEditMode(false);
    };

    return (
        <div className="firearm-card" onClick={handleOnClick}>
            <img src={firearm.firearmImage} alt={`Firearm ${firearm.firearmName}`} className="firearm-image" />
            <div className="firearm-info">
                {editMode ? (
                    <>
                        <input type="text" name="firearmName" value={editedFirearm.firearmName} onChange={handleInputChange} className="editable-field" />
                        <input type="text" name="firearmType" value={editedFirearm.firearmType} onChange={handleInputChange} className="editable-field" />
                        <input type="text" name="firearmMake" value={editedFirearm.firearmMake} onChange={handleInputChange} className="editable-field" />
                        <input type="text" name="firearmModel" value={editedFirearm.firearmModel} onChange={handleInputChange} className="editable-field" />
                        <input type="text" name="firearmCaliber" value={editedFirearm.firearmCaliber} onChange={handleInputChange} className="editable-field" />
                        <input type="text" name="firearmPrice" value={editedFirearm.firearmPrice} onChange={handleInputChange} className="editable-field" />
                        <input type="date" name="firearmPurchasedate" value={editedFirearm.firearmPurchasedate} onChange={handleInputChange} className="editable-field" />
                    </>
                ) : (
                    <>
                    <Link to={`/firearmDetail/${firearm._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h2>{firearm.firearmName}</h2>
                        <p>Type: {firearm.firearmType}</p>
                        <p>Make: {firearm.firearmMake}</p>
                        <p>Model: {firearm.firearmModel}</p>
                        <p>Caliber: {firearm.firearmCaliber}</p>
                        <p>Price: ${firearm.firearmPrice}</p>
                        <p>Purchase Date: {firearm.firearmPurchasedate}</p>
                    </Link></>
                )}
            </div>
            <div className="card-actions">
                {editMode ? (
                    <>
                        <button onClick={saveChanges} className="button save-button">Save</button>
                        <button onClick={cancelChanges} className="button cancel-button">Cancel</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setEditMode(true)} className="button edit-button">Edit</button>
                        <button onClick={() => onDelete(firearm)} className="button delete-button">Delete</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FirearmCard;
