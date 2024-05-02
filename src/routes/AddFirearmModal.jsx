import React, { useState, useEffect } from "react";
import 'bulma/css/bulma.css'; // Ensure Bulma is imported if not already globally

function AddFirearmModal({ isOpen, onClose }) {
    const [uploadUrl, setUploadUrl] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [firearmData, setFirearmData] = useState({
        firearmName: '',
        firearmType: '',
        firearmMake: '',
        firearmModel: '',
        firearmCaliber: '',
        firearmPrice: '',
        firearmPurchasedate: '',
        firearmImage: '',
    });

    useEffect(() => {
        if (isOpen) {
            setCloudFlareUploadURL();
        }
    }, [isOpen]);

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
    
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreview(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      };
      const setCloudFlareUploadURL = async () => {
        const result = await fetch("/api/getuploadurl", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
        })
        const response = await result.json(); 
        if (response.uploadURL) {
            setUploadUrl(response.uploadURL);
          
        }
      }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFirearmData(prev => ({ ...prev, [name]: value }));
    };
    const uploadImage = async () => {
        const formData = new FormData();
        if (imagePreview) {
            const blob = await fetch(imagePreview).then((r) => r.blob());
            formData.append('file', blob);
        }   
        if (uploadUrl){
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error("Failed to upload image");
            }
            const data = await response.json();
            console.log(data);
            return data.result.variants[0];

        }
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        await setCloudFlareUploadURL();
        const URL = await uploadImage(); 
        const completeData = {
            ...firearmData,
            firearmImage: URL
        };       
        const response = await fetch('/api/firearm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(completeData)
        });
        if (!response.ok) {
            throw new Error("Failed to submit firearm data");
        }
        onClose();
        
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal is-active">
        <div className="modal-background" onClick={onClose}></div>
        <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title">Add Firearm</p>
                <button className="delete" aria-label="close" onClick={onClose}></button>
            </header>
            <section className="modal-card-body">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="field">
                        <label className="label">Image File</label>
                        <div className="control">
                            <input className="input" type="file" onChange={handleImageChange} />
                            {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />}
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Firearm Name</label>
                        <div className="control">
                            <input className="input" type="text" name="firearmName" value={firearmData.firearmName} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Firearm Type</label>
                        <div className="control">
                            <input className="input" type="text" name="firearmType" value={firearmData.firearmType} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Firearm Make</label>
                        <div className="control">
                            <input className="input" type="text" name="firearmMake" value={firearmData.firearmMake} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Firearm Model</label>
                        <div className="control">
                            <input className="input" type="text" name="firearmModel" value={firearmData.firearmModel} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Caliber</label>
                        <div className="control">
                            <input className="input" type="text" name="firearmCaliber" value={firearmData.firearmCaliber} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Price</label>
                        <div className="control">
                            <input className="input" type="text" name="firearmPrice" value={firearmData.firearmPrice} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Purchase Date</label>
                        <div className="control">
                            <input className="input" type="date" name="firearmPurchasedate" value={firearmData.firearmPurchasedate} onChange={handleInputChange} />
                        </div>
                    </div>

                    <button className="button is-success" type="submit">Submit Firearm Info</button>
                </form>
            </section>
            <footer className="modal-card-foot">
                <button className="button" onClick={onClose}>Close</button>
            </footer>
        </div>
    </div>
    );
}

export default AddFirearmModal;
