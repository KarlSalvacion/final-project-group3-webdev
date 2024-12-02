import React, { useEffect, useState } from 'react';
import '../../Admin CSS Components/manageBooking CSS/adminManageBookings.css'; // Add your CSS file for styling

const AdminManageBookings = () => {
  const [allBookings, setAllBookings] = useState([]);

  useEffect(() => {
    const fetchAllBookings = () => {
      const bookings = [];
      // Loop through all keys in local storage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Check if the key ends with "Bookings"
        if (key && key.endsWith('Booking')) {
          const username = key.replace('Booking', ''); // Extract the username from the key
          const userBookings = JSON.parse(localStorage.getItem(key));
          if (Array.isArray(userBookings)) {
            userBookings.forEach(booking => {
              booking.username = username; // Add the username to each booking
            });
            bookings.push(...userBookings); // Add user bookings to the array
          }
        }
      }
      setAllBookings(bookings); // Set the state with all bookings
    };
  
    fetchAllBookings();
  }, []);

  const handleDelete = (bookingCode) => {
    // Logic to delete the booking from local storage
    const updatedBookings = allBookings.filter(booking => booking.bookingCode !== bookingCode);
    setAllBookings(updatedBookings);
    // You may also need to update local storage accordingly
    // Implement localStorage update logic here if necessary
  };

  return (
    <div className="admin-manage-bookings-container">
      <h1>Manage Bookings</h1>
      {allBookings.length === 0 ? (
        <p className="nobooking">No bookings found.</p>
      ) : (
        <div className="bookings-list">
          {allBookings.map((booking, index) => (
            <div key={index} className="booking-card">
              <div className="booking-details">
                <div className="booking-item">
                  <span className="label">Username:</span>
                  <span>{booking.username}</span>
                </div>
                <div className="booking-item">
                  <span className="label">Flight Number:</span>
                  <span>{booking.flightDetails.flightNumber}</span>
                </div>
                <div className="booking-item">
                  <span className="label">From:</span>
                  <span>{booking.flightDetails.from}</span>
                </div>
                <div className="booking-item">
                  <span className="label">To:</span>
                  <span>{booking.flightDetails.to}</span>
                </div>
                <div className="booking-item">
                  <span className="label">Departure Date:</span>
                  <span>{booking.flightDetails.departureDate}</span>
                </div>
                <div className="booking-item">
                  <span className="label">Departure Time:</span>
                  <span>{booking.flightDetails.departureTime}</span>
                </div>
                <div className="booking-item">
                  <span className="label">Arrival Time:</span>
                  <span>{booking.flightDetails.arrivalTime}</span>
                </div>
                <div className="booking-item">
                  <span className="label">Selected Seats:</span>
                  <span>{booking.selectedSeats.join(', ')}</span>
                </div>
                <div className="booking-item">
                  <span className="label">Cabin Class:</span>
                  <span>{booking.flightDetails.cabinClass}</span>
                </div>
                <button className="delete-button" onClick={() => handleDelete(booking.bookingCode)}>Delete</button>
              </div>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminManageBookings;