import '../common/style.css';
import React from 'react';
import { Link } from 'react-router-dom';
function App() {
    return (
        <div className="components-container">
          <Link to="/firearm_inventory" className='bottom-link action-button'>Firearm</Link>
          <Link to="/rangevisit/add" className='bottom-link action-button'>Range Visit</Link>
          <Link to="/firearm_maintenance" className='bottom-link action-button'>Maintenance</Link>
        </div>
      );
}

export const Home_Page = {
    path:"/home",
    element:<App></App>,
  }