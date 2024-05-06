import '../common/style.css';
import React from 'react';
import {useState, useEffect, useRef} from "react";
import { Link } from 'react-router-dom';
import FirearmCard from "./FirearmCard.jsx";
function App() {
  const [firearms, setFirearms] = useState([]);
  const scrollContainerRef = useRef(null);
  const [isMouseOver, setIsMouseOver] = useState(false);


  // Fetch firearms data
  const fetchFirearms = async () => {
    const response = await fetch('/api/firearm');
    const data = await response.json();
    setFirearms(data);
  };

  // Fetch data on initial component mount
  useEffect(() => {
    fetchFirearms();
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current && firearms.length > 0) {
      scrollContainerRef.current.scrollLeft = -200 * firearms.length; // Ensure it starts from the leftmost position
    }
  }, [firearms]);

  // Auto-scroll interval logic with looping effect
  useEffect(() => {
    let scrollInterval;

    // Function to automatically scroll
    const autoScroll = () => {
      if (scrollContainerRef.current && !isMouseOver) {
        const container = scrollContainerRef.current;
        container.scrollLeft += 1; // Adjust the scroll speed as needed

        // If at or near the far right, reset to the left
        if (container.scrollLeft*2 >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = -container.clientWidth/2 * firearms.length; // Reset to the start
        }
      }
    };

    // Set up a repeating interval
    scrollInterval = setInterval(autoScroll, 30); // Adjust the interval speed (ms) as needed

    // Clear interval on component unmount
    return () => clearInterval(scrollInterval);
  }, [isMouseOver]);

  // Event handlers for mouse enter/leave
  const handleMouseEnter = () => setIsMouseOver(true);
  const handleMouseLeave = () => setIsMouseOver(false);


  return (
    <div className="home-components-container">
      <div className="components-background-overlay"></div>

      <div className="home-left-side">
        {/* Top section of the left side */}
        <div className="home-left-top">
          <Link to="/firearm_inventory" className="inventory-link">
            {`You have ${firearms.length} firearm${firearms.length === 1 ? '' : 's'} in your inventory`}
          </Link>
        </div>

        {/* Bottom section of the left side */}
        <div
          className="home-left-bottom"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="horizontal-scroll-container" ref={scrollContainerRef}>
            {firearms.map((firearm, index) => (
              <div key={`${firearm._id}-${index}`} className="firearm-wrapper">
                <FirearmCard
                  firearm={firearm}
                  displayOnly={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="home-right-side">
        <h2>Right Side Content</h2>
      </div>
    </div>
  );
}

export const Home_Page = {
    path:"/home",
    element:<App></App>,
  }