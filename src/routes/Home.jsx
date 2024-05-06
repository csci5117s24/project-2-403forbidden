import '../common/style.css';
import React from 'react';
import {useState, useEffect, useRef} from "react";
import { Link } from 'react-router-dom';
import FirearmCard from "./FirearmCard.jsx";
import MapImageSummary from '../common/MapImageSummary';
import LastMonthChart from '../common/LastMonthChart';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
function App() {
  const navigate = useNavigate();
  const [firearms, setFirearms] = useState([]);
  const scrollContainerRef = useRef(null);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const [rangevisits, setRangevisits] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [nextVisit, setNextVisit] = useState([]);

  // Fetch firearms data
  const fetchFirearms = async () => {
    const response = await fetch('/api/firearm');
    const data = await response.json();
    setFirearms(data);
  };

  // Fetch data on initial component mount
  useEffect(() => {
    fetchFirearms();
    console.log(firearms);
  }, []);

  const fetchRangeVisits = async () => {
    const response = await fetch('/api/rangevisits/all');
    const data = await response.json();
    setRangevisits(data.data);
  };

  // Fetch data on initial component mount
  useEffect(() => {
    fetchRangeVisits();
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current && firearms.length > 0) {
      scrollContainerRef.current.scrollLeft = -200 * firearms.length; // Ensure it starts from the leftmost position
    }
  }, [firearms]);

  useEffect(() => {
    console.log(rangevisits);
    const cordList = rangevisits.map(visit => ({
      lat: visit.rangeLat,
      lng: visit.rangeLng
    }));
    setCoordinates(cordList);
    const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset the time to midnight for comparison

  // Filter and sort range visits
  const upcomingVisits = rangevisits
    .filter(visit => {
      // Parse visit date and check if it's after today's date
      const visitDate = new Date(visit.visitDate);
      return visitDate >= today; // Only future dates
    })
    .sort((a, b) => {
      // Sort by date (closest to today first)
      const dateA = new Date(a.visitDate);
      const dateB = new Date(b.visitDate);
      return dateA - dateB; // Ascending order (closest first)
    });

  // The first item is the visit closest to today
    const closestVisit = upcomingVisits[0];
    console.log("Next visit");
    console.log(closestVisit);
    setNextVisit(closestVisit);

  }, [rangevisits]);

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

  const handleContainerClick = () => {
    navigate('/rangevisit/add'); // Navigate to the "rangevisit/add" route
  };

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
        {/* Top Section */}
        <div className="home-right-top">
        <div className="home-map-container" onClick={handleContainerClick}>
          <MapImageSummary coordinates={coordinates} className="home-map-image" /> {/* Updated map class */}
        </div>
        <div className="home-chart-container">
          <h2>Last Month's Visits</h2>
          <div className="chart-responsive">
            <LastMonthChart rangevisits={rangevisits} />
          </div>
        </div>
        </div>

        {/* Bottom Section */}
        <div className="home-right-bottom">
          {/* Conditional rendering based on whether nextVisit is null */}
          <div className="home-right-bottom">
            {nextVisit ? (
              <Link to={`/rangevisit/${nextVisit._id}`} className="home-next-visit-link">
                <div>
                {/* Display the upcoming range visit date */}
                <p>Upcoming Range Visit: {moment(nextVisit.visitDate).format('YYYY-MM-DD')}</p>
                
                {/* Check if there are visit details and display them */}
                {nextVisit.visitDetail && nextVisit.visitDetail.length > 0 && (
                  <div className="home-detail-list">
                  {firearms && nextVisit.visitDetail.map((detail, index) => {
                    const firearm = firearms.find(f => f._id === detail.firearm);
                    
                    // Check if the firearm object is defined before rendering the link
                    if (firearm) {
                      return (
                        <Link to={`/firearm/${firearm._id}`} className="home-next-visit-link" key={detail.id}>
                          <div className="detail-item">
                            <span className="firearm">{firearm.firearmName}</span>
                            <span className="value">{detail.value} rounds</span>
                          </div>
                        </Link>
                      );
                    } else {
                      // Handle missing firearm cases (optional: Customize this message as needed)
                      return (
                        <div key={detail.id} className="detail-item">
                          <span className="firearm">Unknown Firearm</span>
                          <span className="value">{detail.value} rounds</span>
                        </div>
                      );
                    }
                  })}
                </div>
                )}
              </div>
              </Link>
              
            ) : (
              // Display message if there is no upcoming visit
              <p>Plan your next visit now!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Home_Page = {
    path:"/home",
    element:<App></App>,
  }