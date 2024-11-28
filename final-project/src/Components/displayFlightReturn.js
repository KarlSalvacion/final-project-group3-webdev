import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import flights from "../Data/flightsList"; // Import the flights data from the JSON file
import "../CSS Components/displayFlightReturn.css";

const DisplayFlightReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure the incoming state
  const { from, to, departureDate, returnDate, passengerCounts, classType } = location.state || {};

  const [selectedDepartureFlight, setSelectedDepartureFlight] = useState(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
  const [noAvailableDepartureFlights, setNoAvailableDepartureFlights] = useState(false); // To track departure flight availability
  const [noAvailableReturnFlights, setNoAvailableReturnFlights] = useState(false); // To track return flight availability

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

  const handleSubmitBooking = () => {
    if (selectedDepartureFlight && selectedReturnFlight) {
      // Navigate to the seat selection page and pass the selected flights as state
      navigate("/seat-selection", {
        state: {
          departureFlight: selectedDepartureFlight,
          returnFlight: selectedReturnFlight,
          from,
          to,
          departureDate,
          returnDate,
          passengerCounts,
          classType,
        },
      });
    } else {
      alert("Please select both departure and return flights.");
    }
  };
  

  const handleBack = () => {
    navigate("/flight-booking");
  };

  return (
    <div className="display-container">
      {/* Display available flights title only if there are available flights */}
      {!noAvailableDepartureFlights && !noAvailableReturnFlights && (
        <>
          <h2 className="title">Available Flights</h2>
        </>
      )}

      {/* If no flights available, show message instead */}
      {noAvailableDepartureFlights && (
        <div className="no-flights-message">
          <p className="message">Sorry! No departure flights found for the selected criteria.</p>
        </div>
      )}
      {noAvailableReturnFlights && (
        <div className="no-flights-message">
          <p className="message">Sorry! No return flights found for the selected criteria.</p>
        </div>
      )}

      {/* Display Departure Flights */}
      {!noAvailableDepartureFlights && (
        <>
          <h3>Departure Flights</h3>
          <p>
            <strong>{from}</strong> to <strong>{to}</strong> on <strong>{departureDate}</strong>
          </p>
          <div className="flight-cards-container">
            {filteredDepartureFlights.map((flight) => (
              <div
                key={flight.flightNumber}
                className={`flight-card ${selectedDepartureFlight?.flightNumber === flight.flightNumber ? "selected" : ""}`}
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
                  className={`select-button ${selectedDepartureFlight?.flightNumber === flight.flightNumber ? "selected" : ""}`}
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

      {/* Display Return Flights */}
      {!noAvailableReturnFlights && (
        <>
          <h3>Return Flights</h3>
          <p>
            <strong>{to}</strong> to <strong>{from}</strong> on <strong>{returnDate}</strong>
          </p>
          <div className="flight-cards-container">
            {filteredReturnFlights.map((flight) => (
              <div
                key={flight.flightNumber}
                className={`flight-card ${selectedReturnFlight?.flightNumber === flight.flightNumber ? "selected" : ""}`}
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
                  className={`select-button ${selectedReturnFlight?.flightNumber === flight.flightNumber ? "selected" : ""}`}
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

      {/* Back Button */}
      <button className="back-button" onClick={handleBack}>
        Back to Booking
      </button>

      {/* Show Submit Button only if both flights are selected */}
      {!noAvailableDepartureFlights && !noAvailableReturnFlights && (
        <div className="button-container">
          <button
            className="submit-booking-button"
            onClick={handleSubmitBooking}
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
