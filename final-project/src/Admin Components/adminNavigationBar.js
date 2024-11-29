import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Admin CSS Components/adminNavigationBar.css';

const AdminNavBar = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove both admin and user sessions from localStorage
        localStorage.removeItem('loggedInAdmin');
        localStorage.removeItem('loggedInUser');
        
        // Optionally, refresh the page or reset auth state globally
        navigate('/'); // Redirect to home page
    };

    return (
        <div className="main-container">
            <div className="navbar-container">
                <nav className="navbar">
                    <div className="container-fluid">
                        {/* Navbar Brand */}
                        <Link to="/admin-dashboard" className="navbar-brand">LOGO AND NAME</Link>

                        {/* Navbar Tabs */}
                        <div className="navbar-tabs">
                            <Link to="/admin-dashboard" className="tab">Dashboard</Link>
                        </div>

                        {/* Log Out Button */}
                        <button className="logout-button" onClick={handleLogout}>
                            Log Out
                        </button>
                    </div>
                </nav>
            </div>

            <div className="main-work-area-container">
                {children}
            </div>
        </div>
    );
};

export default AdminNavBar;
