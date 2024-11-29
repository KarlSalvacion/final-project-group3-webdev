import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS Components/viewFlights.css";
import flightLists from "../Data/flightsList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";

const ViewFlights = () => {
  const navigate = useNavigate();

  const handleBookFlight = (flight) => {
    // Navigate to the seat selection page, passing flight details
    navigate("/seat-selection", { state: { flight } });
  };

  return (
    <div className="flight-container">
      <h1 className="title">Available Flights</h1>
      {flightLists.length === 0 ? (
        <div className="no-flights-message">
          <p className="message">Sorry! No flights available at the moment.</p>
        </div>
      ) : (
        <div className="flight-list">
          {flightLists.map((flight, index) => (
            <div className="flight-card" key={index}>
              <h2>
                {flight.from}{" "}
                <FontAwesomeIcon icon={faPlane} className="icon-plane" />{" "}
                {flight.to}
              </h2>
              <p>
                <strong>Departure:</strong> {flight.departureDate} at{" "}
                {flight.departureTime}
              </p>
              {flight.returnDate && flight.returnTime ? (
                <p>
                  <strong>Return:</strong> {flight.returnDate} at{" "}
                  {flight.returnTime}
                </p>
              ) : (
                <p>
                  <em>One-way flight</em>
                </p>
              )}
              <p>
                <strong>Passengers:</strong> {flight.passengers}
              </p>
              <button
                className="book-button"
                onClick={() => handleBookFlight(flight)}
              >
                Book
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewFlights;
