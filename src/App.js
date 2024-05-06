import './App.css';
import './common/style.css'
import { Link, Outlet ,useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Carousel from './common/FrontPageImage';
function App() {
  const [userInfo, setUserInfo] = useState();
  const navigate = useNavigate();
  const redirectToHome = () => navigate('/', { replace: true });

  useEffect(() => {
    (async () => {
      const user = await getUserInfo();
      setUserInfo(user);

      // If not logged in, redirect to home page
      if (!user) {
        redirectToHome();
      }
    })();
  }, []);

  const findClaimValue = (claims, claimType) => {
    const claim = claims.find(c => c.typ === claimType);
    return claim ? claim.val : null;
  };
  
  // Modified async function to fetch and extract user information
  async function getUserInfo() {
    try {
      const response = await fetch('/.auth/me');
      const payload = await response.json();
      const { clientPrincipal } = payload;
  
      // Extract relevant fields to create a custom userInfo object
      const userInfo = {
        userId: clientPrincipal.userId,
        userDetails: findClaimValue(clientPrincipal.claims, "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"),
        email: findClaimValue(clientPrincipal.claims, "emails"),
        roles: clientPrincipal.userRoles,
        identityProvider: clientPrincipal.identityProvider
      };
  
      return userInfo; // Return the custom user info object
    } catch (error) {
      console.error('No profile could be found:', error);
      return undefined;
    }
  }

  return (
    <div className="App color4-back">
      <div className="top-bar color6-back">
        <div className='home-head color1-back'>
        {userInfo && <Link to="/home" className='color4 nodecoration'>Welcome back, {userInfo.userDetails}</Link>}
        {!userInfo && <p className='color4 nodecoration'>RiffleRig</p>}
        </div>
        <div className='bottom-buttons'>
          <div className='bottom-button-container'>
          {userInfo && <Link to="/firearm_inventory" className='bottom-link'>Firearm</Link>}
          {/* {!userInfo && <a href="/.auth/login/github?post_login_redirect_uri=/home" className='bottom-link'>Login</a>} */}
          {!userInfo && <a href="/.auth/login/aadb2c?post_login_redirect_uri=/home" className='bottom-link'>Login</a>}
          </div>
          <div className='bottom-button-container'>
          {userInfo && <Link to="/rangevisit/add" className='bottom-link'>Range Visit</Link>}
          </div>
          <div className='bottom-button-container'>
          {userInfo && <Link to="/firearm_maintenance" className='bottom-link'>Maintenance</Link>} 
          </div>
          <div className='bottom-button-container'>
          {userInfo && <a href='/.auth/logout' className='bottom-link'>Log out</a>}
          </div>
        </div>
      </div>
      {!userInfo && <Carousel />} {/* Show carousel if user isn't logged in */}

      <Outlet />
    </div>
  );
}

export default App;