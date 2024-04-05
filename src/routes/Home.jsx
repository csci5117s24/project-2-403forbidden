import '../common/style.css';
import React from 'react';

function App() {
    return (
        <div className="components-container">
          <button className="action-button" onClick={() => console.log('Firearm clicked')}>Firearm</button>
          <button className="action-button" onClick={() => console.log('Range Visit clicked')}>Range Visit</button>
          <button className="action-button" onClick={() => console.log('Maintenance clicked')}>Maintenance</button>
        </div>
      );
}

export const Home_Page = {
    path:"/home",
    element:<App></App>,
  }