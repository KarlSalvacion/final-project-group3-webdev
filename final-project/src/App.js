import React, { useEffect } from 'react';
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Navbar from "./Components/navbar";
import FlightBooking from "./Components/flightBooking";
import DisplayFlightOneWay from "./Components/displayFlightOneWay";
import DisplayFlightReturn from "./Components/displayFlightReturn";
import SeatSelection from "./Components/seatSelection";
import Login from "./Components/logIn";
import Signup from "./Components/signUp";
import ManageFlights from "./Components/manageFlights";
import ExplorePage from "./Components/explorePage";
import ViewFlights from "./Components/viewFlights";
import { AuthProvider } from './Components/authContext';

//Admin components
import AdminDashboard from "./Admin Components/adminDashboard";
import AdminNavbar from './Admin Components/adminNavbar';
import AdminManageFlightsNavbar from './Admin Components/adminManageFlightsNavbar';
import AdminViewFlights from './Admin Components/manageFlightsViewAll';
import SearchFlights from './Admin Components/manageFlightsSearch';


function App() {
  const location = useLocation();

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
      {/* Only show Navbar for user routes (not admin routes) */}
      {location.pathname !== "/admin-dashboard" && location.pathname !== "/admin-manage-flights/view-all" && location.pathname !== "/admin-manage-flights/search" && <Navbar />}

      {/* Main work area section */}
      <main className="main-work-area">
        <Routes>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/flight-booking" element={<FlightBooking />} />
          <Route path="/display-flight-one-way" element={<DisplayFlightOneWay />} />
          <Route path="/display-flight-return" element={<DisplayFlightReturn />} />
          <Route path="/seat-selection" element={<SeatSelection />} />
          <Route path="/view-flights" element={<ViewFlights />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/manage-flights" element={<ManageFlights />} />
          
          {/* Admin route with AdminNavBar */}
          <Route
            path="/admin-dashboard"
            element={
              <AdminNavbar>
                <AdminDashboard />
              </AdminNavbar>
            }
          />
          <Route path="/admin-manage-flights/view-all" element={
            <AdminManageFlightsNavbar>
              <AdminViewFlights/>
            </AdminManageFlightsNavbar> 
          } />

          <Route
              path="/admin-manage-flights/search"
              element={
                <AdminManageFlightsNavbar>
                  <SearchFlights />
                </AdminManageFlightsNavbar>
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
