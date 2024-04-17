import '../common/style.css';
import React from 'react';
import { Link } from 'react-router-dom';
function App() {
    return (
        <div className="components-container">
          <Link to="/firearm_inventory" className='bottom-link action-button'>Firearm</Link>
          <Link to="/rangevisit/add" className='bottom-link action-button'>Range Visit</Link>
          <button className="action-button" onClick={() => console.log('Maintenance clicked')}>Maintenance</button>
        </div>
      );
}

export const Home_Page = {
    path:"/home",
    element:<App></App>,
  }