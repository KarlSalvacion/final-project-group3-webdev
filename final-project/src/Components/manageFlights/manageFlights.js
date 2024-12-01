import React, { useState, useEffect } from 'react';
import '../../CSS Components/manageFlights CSS/manageFlights.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom'; // For navigation
import { useAuth } from '../../Components/accountControl/authContext'; // Import auth context to get the username

const ManageFlights = () => {
  const { username } = useAuth(); // Access the logged-in username from context
  const [flight, setFlight] = useState(null);
  const [bookingCode, setBookingCode] = useState(null); // State for the booking code
  const navigate = useNavigate();

  useEffect(() => {
    // Log the username to make sure it is correct
    console.log('Logged-in username:', username);

    // Retrieve flight booking data from localStorage using the username
    const storedFlightBookingData = JSON.parse(localStorage.getItem(`${username}Booking`)); // Use username-based key

    // Debug: Check if we are able to get the flight booking data from localStorage
    console.log('Stored Flight Booking Data:', storedFlightBookingData);

    if (storedFlightBookingData && storedFlightBookingData.length > 0) {
      // We assume the first object in the array is the booking we need
      const booking = storedFlightBookingData[0];

      // Set the booking code from the retrieved booking data
      setBookingCode(booking.bookingCode || 'Not available');

      // Set the flight data from the booking data
      setFlight(booking); // Directly set the flight data from the booking
    } else {
      // If no booking data found for this user, clear the flight state
      setFlight(null);
    }
  }, [username]); // Re-run the effect when the username changes

  const handleCancelFlight = () => {
    // Remove the booking data from localStorage based on the username
    const storedBookings = JSON.parse(localStorage.getItem(`${username}Booking`)) || [];
    const updatedBookings = storedBookings.filter(booking => booking.bookingCode !== bookingCode);

    // Update the flight details in local storage
    const storedFlights = JSON.parse(localStorage.getItem('flights')) || [];
    const updatedFlights = storedFlights.map(flight => {
      if (flight.flightNumber === flight.flightDetails.flightNumber) {
        // Remove occupied seats from the flight details
        flight.occupiedPremiumSeats = flight.occupiedPremiumSeats.filter(seat => !flight.occupiedPremiumSeats.includes(seat));
        flight.occupiedEconomySeats = flight.occupiedEconomySeats.filter(seat => !flight.occupiedEconomySeats.includes(seat));
      }
      return flight;
    });

    // Save the updated bookings and flight details back to localStorage
    localStorage.setItem(`${username}Booking`, JSON.stringify(updatedBookings));
    localStorage.setItem('flights', JSON.stringify(updatedFlights));

    setFlight(null); // Clear state to indicate cancellation
    setBookingCode(null); // Clear booking code
    alert("Your flight booking has been canceled.");
  };

  const handleModifyFlight = () => {
    // Simply navigate to the seat selection page (modify-seats)
    navigate('/seat-selection');
  };

  return (
    <div className="manage-flights-container">
      <h2>Manage Your Flights</h2>
      <div className="flights-list">
        {flight ? (
          <div className="flight-details">
            <h3>Your Booked Flight:</h3>
            <div>
              <strong>Username:</strong> {username} <br /> {/* Display the username */}
              <strong>Flight Number:</strong> {flight.flightNumber} <br />
              <strong>Booking Code:</strong> {bookingCode} <br /> {/* Display the booking code */}
              <strong>Selected Seats:</strong> {flight.selectedSeats.length > 0 ? flight.selectedSeats.join(", ") : "No seats selected"} <br />
              <strong>Class Type:</strong> {flight.flightDetails?.cabinClass || 'Not available'} <br />
              <strong>Adult Passengers:</strong> {flight.flightDetails?.passengerCounts?.adult || 0} <br />
              <strong>Children Pass engers:</strong> {flight.flightDetails?.passengerCounts?.children || 0} <br />
              <strong>Infant Passengers:</strong> {flight.flightDetails?.passengerCounts?.infant || 0} <br />
            </div>
            <div className="buttons-container">
              <button className="modify-button" onClick={handleModifyFlight}>
                Modify Booking
              </button>
              <button className="cancel-button" onClick={handleCancelFlight}>
                Cancel Booking
              </button>
            </div>
          </div>
        ) : (
          <p>No booked flights found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageFlights;