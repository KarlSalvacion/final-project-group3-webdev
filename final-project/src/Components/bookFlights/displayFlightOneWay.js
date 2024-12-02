import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons'; // Import the plane icon
import "../../CSS Components/bookFlights CSS/displayFlightOneWay.css"; // Adjust the path as needed

const DisplayFlightOneWay = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure the incoming state
  const { from, to, departureDate } = location.state || {};

  const [selectedDepartureFlight, setSelectedDepartureFlight] = useState(null);
  const [noAvailableDepartureFlights, setNoAvailableDepartureFlights] = useState(false);
  const [flights, setFlights] = useState([]); // State to store flights from localStorage

  // Fetch flights from localStorage when the component mounts
  useEffect(() => {
    const storedFlights = JSON.parse(localStorage.getItem('flights')) || []; // Retrieve flights from localStorage
    setFlights(storedFlights);
  }, []);

  // Filter flights based on user preferences
  const filteredDepartureFlights = flights.filter(
    (flight) =>
      flight.from === from &&
      flight.to === to &&
      flight.date === departureDate // Ensure date matches for departure
  );

  // Update noAvailableFlights state based on filteredFlights length
  useEffect(() => {
    setNoAvailableDepartureFlights(filteredDepartureFlights.length === 0);
  }, [filteredDepartureFlights]);

  const handleSelectDepartureFlight = (flight) => {
    if (selectedDepartureFlight?.flightNumber === flight.flightNumber) {
      setSelectedDepartureFlight(null); // Unselect the flight if it's already selected
    } else {
      setSelectedDepartureFlight(flight); // Select the flight
    }
  };

  const handleProceed = () => {
    if (selectedDepartureFlight) {
      navigate("/booking-details", {
        state: {
          departureFlight: selectedDepartureFlight, // Pass the selected flight
        },
      }); // Navigate to BookingDetails page
    } else {
      alert("Please select a departure flight.");
    }
};

  const handleBack = () => {
    navigate("/search-flights");
  };

  return (
    <div className="oneway-display-container">
      {/* Display Departure Flights */}
      {!noAvailableDepartureFlights && (
        <>
          <h3 className="oneway-title">Departure Flights</h3>
          <p className="oneway-description">
            <strong>{from}</strong> <FontAwesomeIcon icon={faPlane}/> <strong>{to}</strong> on <strong>{departureDate}</strong>
          </p>
          <div className="oneway-flight-cards-container">
            {filteredDepartureFlights.map((flight) => (
              <div
                key={flight.flightNumber}
                className={`oneway-flight-card ${selectedDepartureFlight?.flightNumber === flight.flightNumber ? "selected" : ""}`}
              >
                <div className="oneway-flight-card-header">
                  <h3>{flight.flightNumber}</h3>
                  <span>{flight.from} <FontAwesomeIcon icon={faPlane}/> {flight.to}</span>
                </div>
                <div className="oneway-flight-card-details">
                  <p>
                    <strong>Departure:</strong> {flight.departureTime}
                  </p>
                  <p>
                    <strong>Arrival:</strong> {flight.arrivalTime}
                  </p>
                  <p>
                    <strong>Current Passengers:</strong> {flight.currentPassengerCount || 0} {/* Display current passengers */}
                  </p>
                  
                  <p>
                    <strong>Economy Price:</strong> ${flight.economyPrice} {/* Display flight price */}
                    <strong>Premium Price:</strong> ${flight.premiumPrice} {/* Display flight price */}
                  </p>
                  
                  {/* Add more fields as necessary */}
                </div>
                <button
                  className={`oneway-select-button ${selectedDepartureFlight?.flightNumber === flight.flightNumber ? "selected" : ""}`}
                  onClick={() => handleSelectDepartureFlight(flight)}
                  onMouseEnter={(e) => (e.target.innerText = selectedDepartureFlight?.flightNumber === flight.flightNumber ? "Unselect" : "Select")}
                  onMouseLeave={(e) => (e.target.innerText = selectedDepartureFlight?.flightNumber === flight.flightNumber ? "Unselect" : "Select")}
                >
                  {selectedDepartureFlight?.flightNumber === flight.flightNumber ? "Unselect" : "Select"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* No Departure Flights Message */}
      {noAvailableDepartureFlights && (
        <div className="oneway-no-flights-message">
          <p className="oneway-message">Sorry! No departure flights found for the selected criteria.</p>
        </div>
      )}

      {/* Back Button */}
      <button className="oneway-back-button" onClick={handleBack}>
        Back to Booking
      </button>

      {/* Show Proceed Button only if a flight is selected */}
      {!noAvailableDepartureFlights && (
        <div className="oneway-button-container">
          <button
            className="oneway-submit-booking-button"
            onClick={handleProceed}
            disabled={!selectedDepartureFlight}
          >
            Proceed
          </button>
        </div>
      )}
    </div>
  );
};

export default DisplayFlightOneWay;