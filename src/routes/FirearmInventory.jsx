import React from "react";
import {useState, useEffect} from "react";
import FirearmCard from "./FirearmCard.jsx";
import AddFirearmModal from "./AddFirearmModal.jsx";
import "./FirearmInventory.css";
function Firearm_Inventory() {
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
const handleUpdate = async (updatedFirearm) => {
    console.log(updatedFirearm);

    const originalFirearms = [...firearms];

    setFirearms(firearms => firearms.map(firearm =>
        firearm._id === updatedFirearm._id ? updatedFirearm : firearm
    ));

    const response = await fetch(`/api/firearm/${updatedFirearm._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFirearm)
    });

    if (!response.ok) {
        console.error('Failed to update the firearm');
        setFirearms(originalFirearms);  
    } else {
        console.log('Firearm updated successfully!');
    }
};





    return (
        <div className="firearm-inventory">
            <div className="inventory-background-overlay"></div>
            <div className="columns is-multiline fixed-height-columns">
            {firearms.map((firearm) => (
                <div className="column is-one-third" key={firearm._id}>
                <FirearmCard key={firearm._id} firearm={firearm} onDelete={() => handleDelete(firearm._id)} onUpdate={(edited)=>handleUpdate(edited)}/>
                </div>
            ))}
            </div>
            <button className="button is-primary fixed-add-button" onClick={openModal}>
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
