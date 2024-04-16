import React, { useState, useEffect } from "react";

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
        <div className="modal-overlay">
            <div className="modal-content">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label>Image File</label>
                    <input type="file" onChange={handleImageChange} />
                    {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />}

                    <label>Firearm Name</label>
                    <input type="text" name="firearmName" value={firearmData.firearmName} onChange={handleInputChange} />

                    <label>Firearm Type</label>
                    <input type="text" name="firearmType" value={firearmData.firearmType} onChange={handleInputChange} />

                    <label>Firearm Make</label>
                    <input type="text" name="firearmMake" value={firearmData.firearmMake} onChange={handleInputChange} />

                    <label>Firearm Model</label>
                    <input type="text" name="firearmModel" value={firearmData.firearmModel} onChange={handleInputChange} />

                    <label>Caliber</label>
                    <input type="text" name="firearmCaliber" value={firearmData.firearmCaliber} onChange={handleInputChange} />

                    <label>Price</label>
                    <input type="text" name="firearmPrice" value={firearmData.firearmPrice} onChange={handleInputChange} />

                    <label>Purchase Date</label>
                    <input type="date" name="firearmPurchasedate" value={firearmData.firearmPurchasedate} onChange={handleInputChange} />

                    <button type="submit">Submit Firearm Info</button>
                </form>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default AddFirearmModal;
