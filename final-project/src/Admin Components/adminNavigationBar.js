import React from 'react';
import { Link } from 'react-router-dom';
import '../Admin CSS Components/adminNavigationBar.css';

const AdminNavBar = ({ children }) => {
    return (
        <div className="main-container">    
            <div className="navbar-container">
                <nav className="navbar">
                    <div className="container-fluid">
                    <Link to="/" className="navbar-brand">LOGO AND NAME</Link>
                    <div className="navbar-tabs">
                        <Link to="/explore" className="tab">Explore</Link>
                        <Link to="/flight-booking" className="tab">Book Flights</Link>
                        <Link to="/manage-flights" className="tab">Manage Flights</Link>
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
            </div>

            <div className="main-work-area-container">
                {children}
            </div>
        </div>
    );
}

export default AdminNavBar;