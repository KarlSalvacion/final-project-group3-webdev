import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../../CSS Components/bookFlights CSS/displayFlightOneWay.css';

const DisplayFlightOneWay = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure the incoming state
  const { from, to, departureDate } = location.state || {};

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [noAvailableFlights, setNoAvailableFlights] = useState(false);
  const [flights, setFlights] = useState([]); // Add state to store the flight data

  // Fetch flights from localStorage when the component mounts
  useEffect(() => {
    const storedFlights = JSON.parse(localStorage.getItem('flights')) || []; // Retrieve flights from localStorage
    setFlights(storedFlights); // Store it in the state
  }, []);

  // Filter flights based on user preferences
  const filteredFlights = flights.filter(
    (flight) =>
      flight.from === from &&
      flight.to === to &&
      flight.date === departureDate
  );

  // Update noAvailableFlights state based on filteredFlights length
  useEffect(() => {
    setNoAvailableFlights(filteredFlights.length === 0);
  }, [filteredFlights]);

  const handleSelectFlight = (flight) => {
    if (selectedFlight?.flightNumber === flight.flightNumber) {
      setSelectedFlight(null);
    } else {
      setSelectedFlight(flight);
      // Save the selected flight to localStorage
      localStorage.setItem("selectedFlight", JSON.stringify(flight));
    }
  };
  

  const handleSubmitBooking = () => {
    if (selectedFlight) {
      navigate("/seat-selection", {
        state: {
          selectedFlight,
        },
      });
    } else {
      alert("Please select a flight to book.");
    }
  };

  const handleBack = () => {
    navigate("/flight-booking");
  };

  return (
    <div className="oneway-display-container">
      {!noAvailableFlights && (
        <>
          <h2 className="oneway-title">Available Flights</h2>
          <p>
            <strong>{from}</strong> to <strong>{to}</strong> on{" "}
            <strong>{departureDate}</strong>
          </p>
        </>
      )}

      {noAvailableFlights ? (
        <div className="oneway-no-flights-message">
          <p className="oneway-message">
            Sorry! No flights found for the selected criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="oneway-flight-cards-container">
            {filteredFlights.map((flight) => (
              <div
                key={flight.flightNumber}
                className={`oneway-flight-card ${selectedFlight?.flightNumber === flight.flightNumber ? "selected" : ""}`}
              >
                <div className="oneway-flight-card-header">
                  <h3>{flight.flightNumber}</h3>
                  <span>
                    {flight.from} to {flight.to}
                  </span>
                </div>
                <div className="oneway-flight-card-details">
                  <p>
                    <strong>Departure:</strong> {flight.departureTime}
                  </p>
                  <p>
                    <strong>Arrival:</strong> {flight.arrivalTime}
                  </p>
                  <p>
                    <strong>Passengers:</strong> {flight.passengers}
                  </p>
                  <p>
                    <strong>Class Type:</strong> {flight.classType || "Not Available"}
                  </p>
                </div>
                <button
                  className={`oneway-select-button ${selectedFlight?.flightNumber === flight.flightNumber ? "selected" : ""}`}
                  onClick={() => handleSelectFlight(flight)}
                  onMouseEnter={(e) =>
                    (e.target.innerText =
                      selectedFlight?.flightNumber === flight.flightNumber ? "Unselect" : "Select")
                  }
                  onMouseLeave={(e) =>
                    (e.target.innerText =
                      selectedFlight?.flightNumber === flight.flightNumber ? "Unselect" : "Select")
                  }
                >
                  {selectedFlight?.flightNumber === flight.flightNumber ? "Unselect" : "Select"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <button className="oneway-back-button" onClick={handleBack}>
        Back to Booking
      </button>

      {!noAvailableFlights && (
        <div className="oneway-button-container">
          <button
            className="oneway-submit-booking-button"
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
