import React, { useEffect, useState } from "react";
import "../../Admin CSS Components/adminHome CSS/adminDashboard.css";

const AdminDashboard = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [flights, setFlights] = useState([]);

  // Replace this with the actual username dynamically if needed
  const username = "User 1"; // Example username, should be dynamic in a real application

  useEffect(() => {
    const fetchAllBookings = () => {
      const bookingsKey = `${username}Bookings`; // Construct the bookings key for the user
      const userBookings = JSON.parse(localStorage.getItem(bookingsKey)) || []; // Get bookings or default to empty array
      setAllBookings(userBookings); // Set the bookings for the user
    };

    const fetchFlights = () => {
      const flightsData = JSON.parse(localStorage.getItem("flights")) || [];
      setFlights(flightsData); // Set flights from local storage
    };

    fetchAllBookings();
    fetchFlights();
  }, [username]); // Dependency array includes username to refetch if it changes

  const totalBookings = allBookings.length; // Total bookings is the length of user bookings
  const totalFlights = flights.length;

  return (
    <div className="admin-dashboard">
      <h1>Welcome to the Admin Dashboard</h1>
      <p>Here you can manage your application settings and user data.</p>

      <div className="summary-section">
        <h2>Bookings Summary</h2>
        <ul>
          <li>Total Bookings: {totalBookings}</li>
          <li>
            Recent Bookings:
            <ul>
              {allBookings.slice(0, 5).map((booking, index) => (
                <li key={index}>
                  {booking.flightDetails.flightNumber} -{" "}
                  {booking.flightDetails.from} to {booking.flightDetails.to}
                  <br />
                  Booking Code: {booking.bookingCode} | Seats:{" "}
                  {booking.selectedSeats.join(", ")}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>

      <div className="summary-section">
        <h2>Flights Summary</h2>
        <ul>
          <li>Total Flights: {totalFlights}</li>
          <li>
            Recent Flights:
            <ul>
              {flights.slice(0, 5).map((flight, index) => (
                <li key={index}>
                  {flight.flightNumber} - {flight.departure} to {flight.arrival}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
