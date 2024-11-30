import React, { useState, useEffect } from 'react';
import '../../CSS Components/manageFlights CSS/manageFlights.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom'; // For navigation
import { useAuth } from '../../Components/accountControl/authContext'; // Import auth context to get the username

const ManageFlights = () => {
  const { username } = useAuth(); // Access the logged-in username from context
  const [flight, setFlight] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve flight search, booking, and flight data from localStorage
    const storedFlightSearchData = JSON.parse(localStorage.getItem('selectedFlight'));
    const storedFlightBookingData = JSON.parse(localStorage.getItem(`${username}Booking`)); // Use username-based key
    const storedFlightData = JSON.parse(localStorage.getItem('flights')); // Retrieve 'flights' data for additional flight details

    if (storedFlightSearchData && storedFlightBookingData) {
      const fullFlightData = {
        ...storedFlightSearchData, // Include user's preferences from search
        ...storedFlightBookingData, // Include booking data
        selectedSeats: storedFlightBookingData.selectedSeats || [], // Add selected seats if they exist
        flightNumber: storedFlightBookingData.flightNumber || 'Not available', // Ensure flight number is included
      };

      // Add flight data (from 'flights' key) if available
      if (storedFlightData) {
        const flightDetails = storedFlightData.find(flight => flight.flightNumber === storedFlightBookingData.flightNumber);
        if (flightDetails) {
          setFlight({
            ...fullFlightData, // Merge with additional flight data from 'flights'
            date: flightDetails.date || 'Not available', // Departure date
            departureTime: flightDetails.departureTime || 'Not available', // Departure time
            arrivalTime: flightDetails.arrivalTime || 'Not available', // Arrival time
            currentPassengers: flightDetails.currentPassengers || 0, // Current passengers
          });
        }
      } else {
        // If no 'flights' data found, use the fullFlightData alone
        setFlight(fullFlightData);
      }
    }
  }, [username]); // Include username in dependency array to re-run effect when it changes

  const handleCancelFlight = () => {
    // Remove booking data from localStorage based on username
    localStorage.removeItem(`${username}Booking`);
    setFlight(null); // Clear state to indicate cancellation
    alert("Your flight booking has been canceled.");
  };

  const handleModifyFlight = () => {
    // Retrieve the selected seats from localStorage to pass it to the modifySeats page
    const storedFlightBookingData = JSON.parse(localStorage.getItem(`${username}Booking`));
  
    if (storedFlightBookingData) {
      // Pass the selected seats to localStorage for modification
      localStorage.setItem('selectedSeatsForModification', JSON.stringify(storedFlightBookingData.selectedSeats));
    }
  
    // Navigate to the modifySeats page for seat modification
    navigate('/modify-seats');
  };
  
  

  return (
    <div className="manage-flights-container">
      <h2>Manage Your Flights</h2>
      <div className="flights-list">
        {flight ? (
          <div className="flight-details">
            <h3>Your Booked Flight:</h3>
            <div>
              <strong>Flight Number:</strong> {flight.flightNumber} <br />
              <strong>From:</strong> {flight.from} <br />
              <strong>To:</strong> {flight.to} <br />
              <strong>Departure Date:</strong> {flight.date} <br />
              <strong>Departure Time:</strong> {flight.departureTime} <br />
              <strong>Arrival Time:</strong> {flight.arrivalTime} <br />
              <strong>Passengers:</strong> {flight.currentPassengers} <br />
              <strong>Selected Seats:</strong> {flight.selectedSeats.length > 0 ? flight.selectedSeats.join(", ") : "No seats selected"}
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
