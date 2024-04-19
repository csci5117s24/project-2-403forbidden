import { Link } from "react-router-dom";
import './style.css'
import moment from 'moment';
import MapImage from './MapImage';
export default function RangeVisitItem({ visit, onDelete }) {
    return (
        <div className="grid-item">
            <button className="delete-button" onClick={(e) => {
                e.stopPropagation(); // Prevents the Link from being triggered
                onDelete(visit._id);
            }}>
                ✕
            </button>
            <Link to={`/rangevisit/${visit._id}`} className="grid-item-link">
                <div className="map-container">
                    <MapImage lat={visit.rangeLat} lng={visit.rangeLng} />
                </div>
                <p>{moment(visit.visitDate).format('YYYY-MM-DD')}</p>
                <p>{visit.duration} min</p>
            </Link>
        </div>
    );
}