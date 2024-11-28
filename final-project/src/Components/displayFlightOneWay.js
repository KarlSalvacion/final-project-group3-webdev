import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import flights from "../Data/flightsList"; // Import the flights data from the JSON file
import "../CSS Components/displayFlightOneWay.css";

const DisplayFlightOneWay = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure the incoming state
  const { from, to, departureDate } = location.state || {};

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [noAvailableFlights, setNoAvailableFlights] = useState(false); // To track flight availability

  // Filter flights based on user preferences
  const filteredFlights = flights.filter(
    (flight) =>
      flight.from === from &&
      flight.to === to &&
      flight.date === departureDate // Ensure date matches
  );

  // Update noAvailableFlights state based on filteredFlights length
  useEffect(() => {
    setNoAvailableFlights(filteredFlights.length === 0);
  }, [filteredFlights]);

  const handleSelectFlight = (flight) => {
    if (selectedFlight?.flightNumber === flight.flightNumber) {
      setSelectedFlight(null); // Unselect the flight if it's already selected
    } else {
      setSelectedFlight(flight); // Select the flight
    }
  };

  const handleSubmitBooking = () => {
    if (selectedFlight) {
      alert(`Booking confirmed for flight: ${selectedFlight.flightNumber}`);
      // Navigate to a confirmation page or perform additional logic here
    } else {
      alert("Please select a flight to book.");
    }
  };

  const handleBack = () => {
    navigate("/flight-booking");
  };

  return (
    <div className="display-container">
      {/* Display available flights title only if there are available flights */}
      {!noAvailableFlights && (
        <>
          <h2 className="title">Available Flights</h2>
          <p>
            <strong>{from}</strong> to <strong>{to}</strong> on <strong>{departureDate}</strong>
          </p>
        </>
      )}

      {/* If no flights available, show message instead */}
      {noAvailableFlights ? (
        <div className="no-flights-message">
          <p className="message">Sorry! No flights found for the selected criteria.</p>
        </div>
      ) : (
        <>
          <div className="flight-cards-container">
            {filteredFlights.map((flight) => (
              <div
                key={flight.flightNumber}
                className={`flight-card ${selectedFlight?.flightNumber === flight.flightNumber ? "selected" : ""}`}
              >
                <div className="flight-card-header">
                  <h3>{flight.flightNumber}</h3>
                  <span>{flight.from} to {flight.to}</span>
                </div>
                <div className="flight-card-details">
                  <p>
                    <strong>Departure:</strong> {flight.departureTime}
                  </p>
                  <p>
                    <strong>Arrival:</strong> {flight.arrivalTime}
                  </p>
                  <p>
                    <strong>Passengers:</strong> {flight.passengers}
                  </p>
                </div>
                <button
                  className={`select-button ${selectedFlight?.flightNumber === flight.flightNumber ? "selected" : ""}`}
                  onClick={() => handleSelectFlight(flight)}
                  onMouseEnter={(e) => (e.target.innerText = selectedFlight?.flightNumber === flight.flightNumber ? "Unselect" : "Select")}
                  onMouseLeave={(e) => (e.target.innerText = selectedFlight?.flightNumber === flight.flightNumber ? "Unselect" : "Select")}
                >
                  {selectedFlight?.flightNumber === flight.flightNumber ? "Unselect" : "Select"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Back Button */}
      <button className="back-button" onClick={handleBack}>
        Back to Booking
      </button>

      {/* Show Submit Button only if flights are available */}
      {!noAvailableFlights && (
        <div className="button-container">
          <button
            className="submit-booking-button"
            onClick={handleSubmitBooking}
            disabled={!selectedFlight}
          >
            Proceed
          </button>
        </div>
      )}
    </div>
  );
};

export default DisplayFlightOneWay;
