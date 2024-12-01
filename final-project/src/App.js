import React, { useEffect } from 'react';
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Navbar from "./Components/userNavbars/navbar";
import SearchFlights from './Components/bookFlights/searchFlights';
import DisplayFlightOneWay from "./Components/bookFlights/displayFlightOneWay";
import DisplayFlightReturn from "./Components/bookFlights/displayFlightReturn";
import BookingDetails from './Components/bookFlights/bookingDetails';
import SeatSelection from "./Components/bookFlights/seatSelection";
import Login from "./Components/accountControl/logIn";
import Signup from "./Components/accountControl/signUp";
import ManageFlights from "./Components/manageFlights/manageFlights";
import ExplorePage from "./Components/userHome/explorePage";
import ViewFlights from "./Components/userViewFlights/viewFlights";
import { AuthProvider } from './Components/accountControl/authContext';

// Admin components
import AdminDashboard from "./Admin Components/adminHome/adminDashboard";
import AdminNavbar from './Admin Components/adminNavbars/adminNavbar';
import AdminManageFlightsNavbar from './Admin Components/adminNavbars/adminManageFlightsNavbar';
import AdminViewFlights from './Admin Components/manageFlights/manageFlightsViewAll';
import AdminSearchFlights from './Admin Components/manageFlights/manageFlightsSearch';
import EditFlights from './Admin Components/manageFlights/manageFlightsEdit';
import AddFlights from './Admin Components/manageFlights/manageFlightsAdd';
import AdminSeatSelection from './Admin Components/manageSeats/adminSeatSelection';

function App() {
  const location = useLocation();

  // Determine if the current route is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the admin user exists
    const adminExists = storedUsers.some(user => user.email === 'admin1@admin.com');
    
    // If the admin user doesn't exist, add it
    if (!adminExists) {
      const adminUser = {
        email: 'admin1@admin.com',
        username: 'Admin1',
        password: 'Admin123'
      };
      storedUsers.push(adminUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      console.log("Admin user added on app load");
    }
  }, []);

  return (
    <div className="App">
      {/* Render Navbar only if it's not an admin route */}
      {!isAdminRoute && <Navbar />}

      {/* Main work area section */}
      <main className="main-work-area">
        <Routes>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/search-flights" element={<SearchFlights />} />
          <Route path="/display-flight-one-way" element={<DisplayFlightOneWay />} />
          <Route path="/display-flight-return" element={<DisplayFlightReturn />} />
          <Route path="/booking-details" element={<BookingDetails/>} />
          <Route path="/seat-selection" element={<SeatSelection />} />
          <Route path="/view-flights" element={<ViewFlights />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/manage-flights" element={<ManageFlights />} />

          {/* Admin routes */}
          <Route
            path="/admin-dashboard"
            element={
              <AdminNavbar>
                <AdminDashboard />
              </AdminNavbar>
            }
          />
          <Route
            path="/admin-manage-flights/view-all"
            element={
              <AdminManageFlightsNavbar>
                <AdminViewFlights />
              </AdminManageFlightsNavbar>
            }
          />
          <Route
            path="/admin-manage-flights/search"
            element={
              <AdminManageFlightsNavbar>
                <AdminSearchFlights />
              </AdminManageFlightsNavbar>
            }
          />
          <Route
            path="/admin-manage-flights/edit/:flightNumber"
            element={
              <AdminManageFlightsNavbar>
                <EditFlights />
              </AdminManageFlightsNavbar>
            }
          />
          <Route
            path="/admin-manage-flights/add"
            element={
              <AdminManageFlightsNavbar>
                <AddFlights />
              </AdminManageFlightsNavbar>
            }
          />

          <Route
            path="/admin-manage-seat-selection"
            element={
              <AdminNavbar>
                <AdminSeatSelection/>
              </AdminNavbar>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function Wrapper() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}
