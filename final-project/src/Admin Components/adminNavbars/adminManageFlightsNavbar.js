import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../Admin CSS Components/adminNavbars CSS/adminManageFlightsNavbar.css';

const AdminManageFlightsNavbar = ({children}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }


  return (
    <div className="manage-flights-navbar">
        <div className="manage-flights-container-fluid">
                <button className="manage-flights-back-button" onClick={handleBack}>
                Back
                </button>
        
            <div className="manage-flights-navbar-tabs">
                    <Link to="/admin-dashboard" className="manage-flights-tab">
                        Dashboard
                    </Link>
                    <Link to="/admin-manage-flights/view-all" className="manage-flights-tab">
                        View All Flights
                    </Link>

                    <Link to="/admin-manage-flights/search" className="manage-flights-tab">
                        Search Flights
                    </Link>
                    
                    <Link to="/admin-manage-flights/add" className="manage-flights-tab">
                        Add Flights
                    </Link>
                    
            </div>

            <div className="manage-flights-blank-space">
                <span></span> {/* Test with simple content */}
            </div>

        </div>
        
        <div className="admin-view-flights-workarea">
            {children}
        </div>
    </div>
  );
};

export default AdminManageFlightsNavbar;
