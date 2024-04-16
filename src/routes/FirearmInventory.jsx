import React from "react";
import {useState, useEffect} from "react";
import FirearmCard from "./FirearmCard.jsx";
import AddFirearmModal from "./AddFirearmModal.jsx";
import "./FirearmInventory.css";
function Firearm_Inventory() {
    // const [isTablet, setIsTablet] = useState(window.innerWidth <= 768);
    const [firearms, setFirearms] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const fetchFirearms = async () => {
        const response = await fetch(`/api/firearm`);
        const data = await response.json();
        setFirearms(data);
    }
    useEffect(() => {
        fetchFirearms();
    }
    , []);
    const openModal = () => {
        setShowModal(true);
    }
    const closeModal = () => {
        setShowModal(false);
        fetchFirearms();
    }
const handleDelete = async (firearmId) => {
    const response = await fetch(`/api/firearm/${firearmId}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        setFirearms(prevFirearms => prevFirearms.filter(f => f._id !== firearmId));
        fetchFirearms();
    } else {
        console.error('Failed to delete the firearm');
    }
};
const handleUpdate = async (firearm) => {
    console.log(firearm);
    const response = await fetch('/api/firearm/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(firearm)
    });

    if (response.ok) {
        console.log('Firearm updated successfully!');
        fetchFirearms();
    } else {
        console.error('Failed to update the firearm');
    }
};




    return (
        <div className="firearm-inventory">
            <div className="card-container">
            {firearms.map((firearm) => (
                <FirearmCard key={firearm._id} firearm={firearm} onDelete={() => handleDelete(firearm._id)} onUpdate={(edited)=>handleUpdate(edited)}/>
            ))}
            </div>
            <button className="add-firearm-btn" onClick={openModal}>
                + Add New Firearm
            </button>
            <AddFirearmModal isOpen={showModal} onClose={closeModal} />
        </div>
    );





}

export const Firearm_Inventory_Page = {
    path: "/firearm_inventory",
    element: <Firearm_Inventory />,
}
