import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS Components/navbar.css'; // Assuming your CSS file is here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../Components/authContext';

const Navbar = ({ children}) => {
  const { isLoggedIn, username, logout, setAuthState } = useAuth(); // Get auth state from context
  const [loading, setLoading] = useState(true); // To manage loading state

  useEffect(() => {
    // Check if there's stored auth info in localStorage when the component mounts
    const storedUser = localStorage.getItem('loggedInUser');
    
    if (storedUser) {
      const { username } = JSON.parse(storedUser);
      setAuthState({ isLoggedIn: true, username });
    } else {
      setAuthState({ isLoggedIn: false, username: '' });
    }

    // Set loading to false after auth state is determined
    setLoading(false);
  }, [setAuthState]);

  const handleLogout = () => {
    logout(); // Clear auth state and logout
    localStorage.removeItem('loggedInUser');
  };

  if (loading) {
    return null; // Prevent rendering the layout until auth state is determined
  }

  return (
    <div className="navbar">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">Logo</Link>

        {/* Navbar Tabs */}
        <div className="navbar-tabs">
          <Link to="/explore" className="tab">Home</Link>
          <Link to="/flight-booking" className="tab">Book Flights</Link>
          <Link to="/view-flights" className="tab">View Flights</Link>
          <Link to="/manage-flights" className="tab">Manage Flights</Link>
        </div>

       
        {/* Account Control */}
        <div className="account-control">
          <div className="profile-icon">
            <FontAwesomeIcon icon={faUser} />
          </div>
          {isLoggedIn ? (
            <div className="username-container">
              <p className="username-text">{username}</p>
              <div className="divider" />
              <button onClick={handleLogout} className="log-out-btn">
              Log out
              </button>
            </div>

            ) : (
            <>
            <Link to="/log-in" className="log-in">
              <p className="log-in-text">Log in</p>
            </Link>

            <div className="divider"/>  
            
            <Link to="/sign-up" className="sign-up">
              <p className="sign-up-text">Sign up</p>
            </Link>
            </>
            )}
          </div>
        </div>

        <div className="main-work-area-container">
          {children}
        </div>
    </div>
  );
};

export default Navbar;
