import React, { useEffect, useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom'; // Import NavLink
import '../../CSS Components/userNavbars CSS/navbar.css'; // Assuming your CSS file is here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser  } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../accountControl/authContext';
import logoLong from '../../Assets/jpg/long-logo.png'; // Ensure this path is correct

const Navbar = ({ children }) => {
  const { isLoggedIn, username, logout, setAuthState } = useAuth(); // Get auth state from context
  const [loading, setLoading] = useState(true); // To manage loading state
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Check if there's stored auth info in localStorage when the component mounts
    const storedUser  = localStorage.getItem('loggedInUser '); // Use the correct key

    if (storedUser ) {
      const { username } = JSON.parse(storedUser );
      setAuthState({ isLoggedIn: true, username });
    } else {
      setAuthState({ isLoggedIn: false, username: '' });
    }

    // Set loading to false after auth state is determined
    setLoading(false);
  }, [setAuthState]);

  const handleLogout = () => {
    logout(); // Clear auth state and logout
    navigate('/'); // Programmatically navigate to the home page after logout
  };

  const handleLoginRedirect = () => {
    // Check if the logged-in user is Admin
    if (username === 'Admin1' || username === 'admin@admin.com') {
      // Additional check for password
      const storedUser  = JSON.parse(localStorage.getItem('loggedInUser '));
      if (storedUser  && storedUser.password === 'Admin123') {
        // Redirect to admin section
        navigate('/admin-dashboard'); // Replace '/admin' with your actual admin section route
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      handleLoginRedirect();
    }
  }, [isLoggedIn, username]); // Trigger login redirect when logged in state or username changes

  if (loading) {
    return null; // Prevent rendering the layout until auth state is determined
  }

  return (
    <div className="navbar">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logoLong} alt="Logo" className="logo-image" /> {/* Use the imported image */}
        </Link>

        {/* Navbar Tabs */}
        <div className="navbar-tabs">
          <NavLink to="/" className={({ isActive }) => `tab ${isActive ? 'active-tab' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/search-flights" className={({ isActive }) => `tab ${isActive ? 'active-tab' : ''}`}>
            Book Flights
          </NavLink>
          <NavLink to="/view-flights" className={({ isActive }) => `tab ${isActive ? 'active-tab' : ''}`}>
            View Flights
          </NavLink>
          <NavLink to="/manage-flights" className={({ isActive }) => `tab ${isActive ? 'active-tab' : ''}`}>
            Manage Flights
          </NavLink>
        </div>

        {/* Account Control */}
        <div className="account-control">
          <div className="profile-icon">
            <FontAwesomeIcon icon={faUser  } />
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

              <div className="divider" />
              
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