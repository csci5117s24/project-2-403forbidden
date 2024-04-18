import { Link } from "react-router-dom";
import './style.css'
import moment from 'moment';
import MapImage from './MapImage';
export default function RangeVisitItem({visit}) {
    return <Link to={`/rangevisit/${visit._id}`} className="grid-item">
                <div className="map-container">
                <MapImage lat={visit.rangeLat} lng={visit.rangeLng}/>
                </div>
                <p>{moment(visit.visitDate).format('YYYY-MM-DD')}</p>
                <p>{visit.duration} min</p>
            </Link>
}