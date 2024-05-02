import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './FirearmCard.css'; 

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
        if (editMode){
            return;
        }

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
        <div className="card" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '10px' }} >
            <div className="card-image" onClick={handleOnClick}>
                <figure className="image is-4by3">
                    <img src={firearm.firearmImage} alt={`Firearm ${firearm.firearmName}`} className="firearm-image" />
                </figure>
            </div>
            <div className="card-content"  onClick={handleOnClick}>
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
                        <Link to={`/firearm/${firearm._id}`} className="nodecoration">
                            <p className="title is-4">{firearm.firearmName}</p>
                            <p className="subtitle is-6">
                                Type: {firearm.firearmType}<br />
                                Make: {firearm.firearmMake}<br />
                                Model: {firearm.firearmModel}<br />
                                Caliber: {firearm.firearmCaliber}<br />
                                Price: ${firearm.firearmPrice}<br />
                                Purchase Date: {firearm.firearmPurchasedate}
                            </p>
                        </Link>
                    </>
                )}
            </div>
            {editMode ? (
    <div className="card-footer">
        <button className="card-footer-item button is-success" onClick={saveChanges}>
            Save
        </button>
        <button className="card-footer-item button is-warning" onClick={cancelChanges}>
            Cancel
        </button>
    </div>
) : (
    <div className="card-footer">
        <button className="card-footer-item button is-info" onClick={() => setEditMode(true)}>
            Edit
        </button>
        <button className="card-footer-item button is-danger" onClick={() => onDelete(firearm)}>
            Delete
        </button>
    </div>
)}

        </div>
    );
}

export default FirearmCard;