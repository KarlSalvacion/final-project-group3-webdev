import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Admin CSS Components/adminNavbars CSS/adminNavbar.css";
import logo from "../../Assets/jpg/long-logo.png"; // Import the logo image
import { useAuth } from "../../Components/accountControl/authContext"; // Adjust the import path accordingly

const AdminNavbar = ({ children }) => {
  const navigate = useNavigate();
  const { username, logout } = useAuth(); // Get username and logout function from the context

  const handleLogout = () => {
    console.log("Logout button clicked");

    // Check local storage before logout
    console.log(
      "Before logout:",
      localStorage.getItem("loggedInAdmin"),
      localStorage.getItem("loggedInUser ")
    );

    // Call the logout function from the context
    logout();

    // Check local storage after logout
    console.log(
      "After logout:",
      localStorage.getItem("loggedInAdmin"),
      localStorage.getItem("loggedInUser ")
    );

    // Redirect to home page
    navigate("/");
  };

  return (
    <div className="admin-navbar">
      <div className="admin-container-fluid">
        <Link to="/admin-dashboard" className="admin-navbar-brand">
          <img
            src={logo}
            alt="Logo"
            style={{ width: "130px", height: "auto" }}
          />
        </Link>

        <div className="admin-navbar-tabs">
          <Link to="/admin-dashboard" className="admin-tab">
            Dashboard
          </Link>
          <Link to="/admin-manage-flights/view-all" className="admin-tab">
            Manage Flights
          </Link>
          <Link to="/admin-manage-bookings" className="admin-tab">
            Manage Bookings
          </Link>
        </div>

        {/* Right Section: Admin Username and Logout */}
        <div className="admin-account-control">
          <div className="profile-icon">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="admin-username-container">
            <p className="admin-username">{username || "Admin"}</p>
            <div className="admin-divider" />
            <button className="admin-logout-button" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
      {/* This is the main work area section */}
      <div className="admin-main-work-area-container">{children}</div>
    </div>
  );
};

export default AdminNavbar;
