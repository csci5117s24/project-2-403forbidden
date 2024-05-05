import { useState, useEffect, useRef } from 'react';
import './style.css'
const Carousel = () => {
  // Define background images and texts
  const slides = [
    {
      image: 'frontpage.png',
      text: 'Welcome to RiffleRig! Explore and manage firearm info.',
    },
    {
      image: 'firearm.png',
      text: 'Track your firearm inventory with ease.',
    },
    {
      image: 'rangevisit.png',
      text: 'Schedule and record range visits effectively.',
    },
    {
      image: 'maintain.png',
      text: 'Maintain and service firearms safely.',
    },
  ];

  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(nextSlide, 5000); // Restart the interval
  };
  // Function to advance to the next slide
  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    resetInterval();
  };

  // Function to go back to the previous slide
  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    resetInterval();
  };

  // Reset the interval timer to avoid interference
  
  // Initialize the automatic slide timer when the component mounts
  useEffect(() => {
    resetInterval();
    return () => clearInterval(intervalRef.current); // Clear interval on component unmount
  }, []);

  return (
    <div className="carousel-container">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          {/* Add overlay for transparency */}
          <div className="carousel-overlay"></div>

          {/* Centered Text Container */}
          <div className="carousel-text-container">
            <h1>{slide.text}</h1>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <div className="arrow-left" onClick={prevSlide}>
        <span className="arrow">&#9664;</span> {/* Left Arrow Symbol */}
      </div>
      <div className="arrow-right" onClick={nextSlide}>
        <span className="arrow">&#9654;</span> {/* Right Arrow Symbol */}
      </div>
    </div>
  );
};

export default Carousel;