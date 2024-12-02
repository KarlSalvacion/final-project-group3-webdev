import React, { useState, useEffect } from 'react';
import '../../CSS Components/manageFlights CSS/manageFlights.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom'; // For navigation
import { useAuth } from '../../Components/accountControl/authContext'; // Import auth context to get the username
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons'; // Import the plane icon

const ManageFlights = () => {
  const { username } = useAuth(); // Access the logged-in username from context
  const [flights, setFlights] = useState([]); // State for all booked flights
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Logged-in username:', username);

    const storedFlightBookingData = JSON.parse(localStorage.getItem(`${username}Booking`)); // Use username-based key

    console.log('Stored Flight Booking Data:', storedFlightBookingData);

    if (storedFlightBookingData && storedFlightBookingData.length > 0) {
      setFlights(storedFlightBookingData);
    } else {
      setFlights([]); // Clear flight state if no bookings are found
    }
  }, [username]); // Re-run the effect when the username changes

  const handleCancelFlight = (bookingCode) => {
    const storedBookings = JSON.parse(localStorage.getItem(`${username}Booking`)) || [];
    const updatedBookings = storedBookings.filter(booking => booking.bookingCode !== bookingCode);

    const storedFlights = JSON.parse(localStorage.getItem('flights')) || [];
    const updatedFlights = storedFlights.map(flight => {
      const bookingToCancel = storedBookings.find(b => b.bookingCode === bookingCode);
      if (bookingToCancel && flight.flightNumber === bookingToCancel.flightDetails.flightNumber) {
        flight.occupiedPremiumSeats = flight.occupiedPremiumSeats || [];
        flight.occupiedEconomySeats = flight.occupiedEconomySeats || [];
        flight.occupiedPremiumSeats = flight.occupiedPremiumSeats.filter(seat => !bookingToCancel.selectedSeats.includes(seat));
        flight.occupiedEconomySeats = flight.occupiedEconomySeats.filter(seat => !bookingToCancel.selectedSeats.includes(seat));
      }
      return flight;
    });

    localStorage.setItem(`${username}Booking`, JSON.stringify(updatedBookings));
    localStorage.setItem('flights', JSON.stringify(updatedFlights));

    setFlights(updatedBookings);
    alert("Your flight booking has been canceled.");
  };

  return (
    <div className="manage-flights-container">
      <h2>Manage Your Flights</h2>
      <div className="flights-list">
        {flights.length > 0 ? (
          flights.map((flight, index) => (
            <div key={index} className="flight-details">
              <div className="flight-info">
                <span className="booking-code">Booking Code: {flight.bookingCode}</span>
                <span className="flight-number">Flight Number: {flight.flightDetails?.flightNumber}</span>
                <span className="from">From {flight.flightDetails?.from}</span>
                <FontAwesomeIcon icon={faPlane} className="plane-icon-manage"/>
                <span className="to">To {flight.flightDetails?.to}</span>
                <span className="departure-date">Departure {flight.flightDetails?.departureDate}</span>
                <span className="departure-time">Departure Time: {flight.flightDetails?.departureTime}</span>
                <span className="arrival-time">Arrival Time:{flight.flightDetails?.arrivalTime}</span>
                <span className="total-pasengers">Total Passengers: {flight.flightDetails?.totalPassengers}</span>
                <span className="selected-seats">Occupied Seats: {flight.selectedSeats.length > 0 ? flight.selectedSeats.join(", ") : "No seats selected"}</span>
                <span className="cabin-class">{flight.flightDetails?.cabinClass || 'Not available'}</span>
              </div>
              <button className="cancel-button" onClick={() => handleCancelFlight(flight.bookingCode)}>
                Cancel Booking
              </button>
            </div>
          ))
        ) : (
          <p className='no-flights-booked'>No booked flights found. Try to log in or book a flight.</p>
        )}
      </div>
    </div>
  );
};

export default ManageFlights;