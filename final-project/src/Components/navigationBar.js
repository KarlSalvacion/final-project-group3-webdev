import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS Components/navigationBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser , faSearch } from '@fortawesome/free-solid-svg-icons'; // Import the user circle and search icons

const Navbar = ({ children }) => {


    return (
        <div className="mainMenu-container">
            <nav className="navbar custom-navbar">
                <div className="container-fluid">
                        <Link to="/" className="navbar-brand">LOGO AND NAME</Link>
                    <div className="navbar-tabs">
                        <Link to="/explore" className="tab">Explore</Link>
                        <Link to="/flight-booking" className="tab">Book Flights</Link>
                        <Link to="/manage-flights" className="tab">Manage Flights</Link>
                    </div>
                    
                    <div className="profile-icon">
                        <FontAwesomeIcon icon={faUser}/> 
                    </div> 
                    <div className="account-control">
                        <Link to="/log-in" className="log-in">
                            <p className="log-in-text">Log in</p>
                        </Link>
                        <div className="divider"/>
                        <Link to="/sign-up" className="sign-up">
                            <p className="sign-up-text">Sign up</p> 
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="mainArea">
                {children}
            </div>
        </div>
    );
};

export default Navbar;