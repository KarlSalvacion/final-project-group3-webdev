import React from "react";
import '../CSS Components/viewFlights.css';
import flightLists from "../Data/flightsList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons'; // Correctly importing the icon

const ViewFlights = () => {
  return (
    <div className="flight-container">
      <h1 className="title">Available Flights</h1>
      <div className="flight-list">
        {flightLists.map((flight, index) => (
          <div className="flight-card" key={index}>
            <h2>
              {flight.from}{" "}
                <FontAwesomeIcon icon={faPlane} className="icon-plane" />{" "}
              {flight.to}
            </h2>
            <p>
              <strong>Departure:</strong> {flight.departureDate} at {flight.departureTime}
            </p>
            {flight.returnDate && flight.returnTime ? (
              <p>
                <strong>Return:</strong> {flight.returnDate} at {flight.returnTime}
              </p>
            ) : (
              <p><em>One-way flight</em></p>
            )}
            <p>
              <strong>Passengers:</strong> {flight.passengers}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewFlights;
