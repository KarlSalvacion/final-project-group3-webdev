import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import flightLists from "../Data/flightsList";
import "../CSS Components/displayFlights.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const AvailableFlights = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { from, to, departureDate, returnDate, passengers } = location.state || {};

  const matchingFlights = flightLists.filter(
    (flight) =>
      flight.from === from &&
      flight.to === to &&
      flight.departureDate === departureDate
  );

  const handleBack = () => {
    navigate("/flight-booking"); // Navigate back to FlightBooking page
  };

  return (
    <div className="available-flights-container">
      <button className="back-button" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> {/* Font Awesome back icon */}
      </button>

      <h2>Available Flights</h2>

      {matchingFlights.length > 0 ? (
        <table className="flights-table">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Departure Date</th>
              <th>Departure Time</th>
              <th>Return Date</th>
              <th>Return Time</th>
              <th>Passengers</th>
            </tr>
          </thead>
          <tbody>
            {matchingFlights.map((flight, index) => (
              <tr key={index}>
                <td>{flight.from}</td>
                <td>{flight.to}</td>
                <td>{flight.departureDate}</td>
                <td>{flight.departureTime}</td>
                <td>{flight.returnDate || "One-way"}</td>
                <td>{flight.returnTime || "One-way"}</td>
                <td>{flight.passengers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No flights found matching your preferences.</p>
      )}
    </div>
  );
};

export default AvailableFlights;
