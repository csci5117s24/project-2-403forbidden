import React from 'react';
import 'bulma/css/bulma.min.css'; // 确保导入了 Bulma
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 引入 FontAwesome 图标库
import { faToolbox, faCalendarAlt, faTag, faIndustry, faInfoCircle } from '@fortawesome/free-solid-svg-icons'; // 引入所需的图标
import { useNavigate } from 'react-router-dom';
const FirearmMaintenanceCard = ({ firearm }) => {
    const navigate = useNavigate();
    const latestMaintenance = firearm.firearmMaintenanceHistory && firearm.firearmMaintenanceHistory[firearm.firearmMaintenanceHistory.length - 1];

    const handleCardClick = () => {
        navigate(`/detailMaintenance/${firearm._id}`);
    };

    return (
        <div className="card" onClick={handleCardClick} style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
            <div className="card-image">
                <figure className="image is-4by3">
                    <img src={firearm.firearmImage} alt={`Firearm ${firearm.firearmName}`} />
                </figure>
            </div>
            <div className="card-content">
                <div className="media">
                    <div className="media-content">
                        <p className="title is-4">{firearm.firearmName}</p>
                        <p className="subtitle is-6">
                            <FontAwesomeIcon icon={faToolbox} /> {firearm.firearmType} - {firearm.firearmCaliber}
                        </p>
                    </div>
                </div>

                <div className="content">
                    <p><FontAwesomeIcon icon={faIndustry} /> Make: {firearm.firearmMake}</p>
                    <p><FontAwesomeIcon icon={faInfoCircle} /> Model: {firearm.firearmModel}</p>
                    <p><FontAwesomeIcon icon={faTag} /> Price: ${firearm.firearmPrice}</p>
                    <p><FontAwesomeIcon icon={faCalendarAlt} /> Purchase Date: {firearm.firearmPurchasedate}</p>
                    {latestMaintenance && (
                        <>
                            <h4 className="title is-6">Last Maintenance:</h4>
                            <p><FontAwesomeIcon icon={faCalendarAlt} /> Date: {latestMaintenance.date}</p>
                            <p><FontAwesomeIcon icon={faToolbox} /> Description: {latestMaintenance.description}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FirearmMaintenanceCard;
