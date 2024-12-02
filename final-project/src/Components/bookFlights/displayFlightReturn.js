import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../CSS Components/bookFlights CSS/displayFlightReturn.css";

const DisplayFlightReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure the incoming state
  const { from, to, departureDate, returnDate } = location.state || {};

  const [selectedDepartureFlight, setSelectedDepartureFlight] = useState(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
  const [noAvailableDepartureFlights, setNoAvailableDepartureFlights] = useState(false);
  const [noAvailableReturnFlights, setNoAvailableReturnFlights] = useState(false);
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

  const filteredReturnFlights = flights.filter(
    (flight) =>
      flight.from === to &&
      flight.to === from &&
      flight.date === returnDate // Ensure date matches for return
  );

  // Update noAvailableFlights state based on filteredFlights length
  useEffect(() => {
    setNoAvailableDepartureFlights(filteredDepartureFlights.length === 0);
    setNoAvailableReturnFlights(filteredReturnFlights.length === 0);
  }, [filteredDepartureFlights, filteredReturnFlights]);

  const handleSelectDepartureFlight = (flight) => {
    if (selectedDepartureFlight?.flightNumber === flight.flightNumber) {
      setSelectedDepartureFlight(null); // Unselect the flight if it's already selected
    } else {
      setSelectedDepartureFlight(flight); // Select the flight
    }
  };

  const handleSelectReturnFlight = (flight) => {
    if (selectedReturnFlight?.flightNumber === flight.flightNumber) {
      setSelectedReturnFlight(null); // Unselect the flight if it's already selected
    } else {
      setSelectedReturnFlight(flight); // Select the flight
    }
  };

  const handleProceed = () => {
    if (selectedDepartureFlight && selectedReturnFlight) {
      navigate("/booking-details", {
        state: {
          departureFlight: selectedDepartureFlight,
          returnFlight: selectedReturnFlight,
        },
      }); // Navigate to BookingDetails page
    } else {
      alert("Please select both departure and return flights.");
    }
  };

  const handleBack = () => {
    navigate("/search-flights");
  };

  return (
    <div className="return-display-container">
      {/* Display Departure Flights */}
      {!noAvailableDepartureFlights && (
        <>
          <h3>Departure Flights</h3>
          <p>
            <strong>{from}</strong> to <strong>{to}</strong> on <strong>{departureDate}</strong>
          </p>
          <div className="return-flight-cards-container">
            {filteredDepartureFlights.map((flight) => (
              <div
                key={flight.flightNumber}
                className={`return-flight-card ${selectedDepartureFlight?.flightNumber === flight.flightNumber ? "selected" : ""}`}
              >
                <div className="return-flight-card-header">
                  <h3>{flight.flightNumber}</h3>
                  <span>{flight.from} to {flight.to}</span>
                </div>
                <div className="return-flight-card-details">
                  <p>
                    <strong>Departure:</strong> {flight.departureTime}
                  </p>
                  <p>
                    <strong>Arrival:</strong> {flight.arrivalTime}
                  </p>
                  <p>
                    <strong>Current Passengers:</strong> {flight.currentPassengerCount || 0} {/* Display current passengers */}
                  </p>
                </div>
                <button
                  className={`return-select-button ${selectedDepartureFlight?.flightNumber === flight.flightNumber ? "selected" : ""}`}
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
        <div className="return-no-flights-message">
          <p className="return-message">Sorry! No departure flights found for the selected criteria.</p>
        </div>
      )}

      {/* Display Return Flights */}
      {!noAvailableReturnFlights && (
        <>
          <h3>Return Flights</h3>
          <p>
            <strong>{to}</strong> to <strong>{from}</strong> on <strong>{returnDate}</strong>
          </p>
          <div className="return-flight-cards-container">
            {filteredReturnFlights.map((flight) => (
              <div
                key={flight.flightNumber}
                className={`return-flight-card ${selectedReturnFlight?.flightNumber === flight.flightNumber ? "selected" : ""}`}
              >
                <div className="return-flight-card-header">
                  <h3>{flight.flightNumber}</h3>
                  <span>{flight.from} to {flight.to}</span>
                </div>
                <div className="return-flight-card-details">
                  <p>
                    <strong>Departure:</strong> {flight.departureTime}
                  </p>
                  <p>
                    <strong>Arrival:</strong> {flight.arrivalTime}
                  </p>
                  <p>
                    <strong>Current Passengers:</strong> {flight.currentPassengerCount || 0} {/* Display current passengers */}
                  </p>
                </div>
                <button
                  className={`return-select-button ${selectedReturnFlight?.flightNumber === flight.flightNumber ? "selected" : ""}`}
                  onClick={() => handleSelectReturnFlight(flight)}
                  onMouseEnter={(e) => (e.target.innerText = selectedReturnFlight?.flightNumber === flight.flightNumber ? "Unselect" : "Select")}
                  onMouseLeave={(e) => (e.target.innerText = selectedReturnFlight?.flightNumber === flight.flightNumber ? "Unselect" : "Select")}
                >
                  {selectedReturnFlight?.flightNumber === flight.flightNumber ? "Unselect" : "Select"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* No Return Flights Message */}
      {noAvailableReturnFlights && (
        <div className="return-no-flights-message">
          <p className="return-message">Sorry! No return flights found for the selected criteria.</p>
        </div>
      )}

      {/* Back Button */}
      <button className="return-back-button" onClick={handleBack}>
        Back to Booking
      </button>

      {/* Show Proceed Button only if both flights are selected */}
      {!noAvailableDepartureFlights && !noAvailableReturnFlights && (
        <div className="return-button-container">
          <button
            className="return-submit-booking-button"
            onClick={handleProceed}
            disabled={!selectedDepartureFlight || !selectedReturnFlight}
          >
            Proceed
          </button>
        </div>
      )}
    </div>
  );
};

export default DisplayFlightReturn;