import React, { useState, useEffect } from 'react';
import '../../CSS Components/manageFlights CSS/manageFlights.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom'; // For navigation
import { useAuth } from '../../Components/accountControl/authContext'; // Import auth context to get the username

const ManageFlights = () => {
  const { username } = useAuth(); // Access the logged-in username from context
  const [flights, setFlights] = useState([]); // State for all booked flights
  const navigate = useNavigate();

  useEffect(() => {
    // Log the username to make sure it is correct
    console.log('Logged-in username:', username);

    // Retrieve flight booking data from localStorage using the username
    const storedFlightBookingData = JSON.parse(localStorage.getItem(`${username}Booking`)); // Use username-based key

    // Debug: Check if we are able to get the flight booking data from localStorage
    console.log('Stored Flight Booking Data:', storedFlightBookingData);

    if (storedFlightBookingData && storedFlightBookingData.length > 0) {
      // Set all bookings to state
      setFlights(storedFlightBookingData);
    } else {
      // If no booking data found for this user, clear the flight state
      setFlights([]); // Clear flight state if no bookings are found
    }
  }, [username]); // Re-run the effect when the username changes

  const handleCancelFlight = (bookingCode) => {
    // Remove the booking data from localStorage based on the username and bookingCode
    const storedBookings = JSON.parse(localStorage.getItem(`${username}Booking`)) || [];
    const updatedBookings = storedBookings.filter(booking => booking.bookingCode !== bookingCode);

    // Update the flight details in local storage
    const storedFlights = JSON.parse(localStorage.getItem('flights')) || [];
    const updatedFlights = storedFlights.map(flight => {
      // Find the booking that matches the booking code
      const bookingToCancel = storedBookings.find(b => b.bookingCode === bookingCode);
      if (bookingToCancel && flight.flightNumber === bookingToCancel.flightDetails.flightNumber) {
        // Ensure occupied seats arrays are defined
        flight.occupiedPremiumSeats = flight.occupiedPremiumSeats || [];
        flight.occupiedEconomySeats = flight.occupiedEconomySeats || [];

        // Remove occupied seats from the flight details
        flight.occupiedPremiumSeats = flight.occupiedPremiumSeats.filter(seat => !bookingToCancel.selectedSeats.includes(seat));
        flight.occupiedEconomySeats = flight.occupiedEconomySeats.filter(seat => !bookingToCancel.selectedSeats.includes(seat));
      }
      return flight;
    });

    // Save the updated bookings and flight details back to localStorage
    localStorage.setItem(`${username}Booking`, JSON.stringify(updatedBookings));
    localStorage.setItem('flights', JSON.stringify(updatedFlights));

    // Update state to reflect cancellation
    setFlights(updatedBookings); // Update the flights state with the remaining bookings
    alert("Your flight booking has been canceled.");
  };

  const handleModifyFlight = (flight) => {
    // Navigate to the seat selection page (modify-seats)
    navigate('/seat-selection', { state: { bookingDetails: flight } }); // Pass flight details to modify
  };

  return (
    <div className="manage-flights-container">
      <h2>Manage Your Flights</h2>
      <div className="flights-list">
        {flights.length > 0 ? (
          flights.map((flight, index) => (
            <div key={index} className="flight-details">
              <h3>Your Booked Flight:</h3>
              <div>
                <strong>Username:</strong> {username} <br /> {/* Display the username */}
                <strong>Flight Number:</strong> {flight.flightDetails?.flightNumber} <br />
                <strong>Booking Code:</strong> {flight.bookingCode} <br /> {/* Display the booking code */}
                <strong>From:</strong> {flight.flightDetails?.from} <br /> {/* Display the departure location */}
                <strong>To:</strong> {flight.flightDetails?.to} <br /> {/* ```javascript
                <strong>Departure Date:</strong> {flight.flightDetails?.departureDate} <br /> {/* Display departure date */}
                <strong>Departure Time:</strong> {flight.flightDetails?.departureTime} <br /> {/* Display departure time */}
                <strong>Arrival Time:</strong> {flight.flightDetails?.arrivalTime} <br /> {/* Display arrival time */}
                <strong>Occupied Seats:</strong> {flight.selectedSeats.length > 0 ? flight.selectedSeats.join(", ") : "No seats selected"} <br />
                <strong>Class Type:</strong> {flight.flightDetails?.cabinClass || 'Not available'} <br />
                <strong>Adult Passengers:</strong> {flight.flightDetails?.passengerCounts?.adult || 0} <br />
                <strong>Children Passengers:</strong> {flight.flightDetails?.passengerCounts?.children || 0} <br />
                <strong>Infant Passengers:</strong> {flight.flightDetails?.passengerCounts?.infant || 0} <br />
              </div>
              <div className="buttons-container">
                <button className="modify-button" onClick={() => handleModifyFlight(flight)}>
                  Modify Booking
                </button>
                <button className="cancel-button" onClick={() => handleCancelFlight(flight.bookingCode)}>
                  Cancel Booking
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No booked flights found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageFlights;