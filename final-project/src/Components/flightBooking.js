import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS Components/flightBooking.css";

const FlightBooking = () => {
  // Load saved data from localStorage if available
  const savedData = JSON.parse(localStorage.getItem("flightSearchData")) || {};

  const [from, setFrom] = useState(savedData.from || "");
  const [to, setTo] = useState(savedData.to || "");
  const [departureDate, setDepartureDate] = useState(savedData.departureDate || "");
  const [returnDate, setReturnDate] = useState(savedData.returnDate || "");
  const [passengers, setPassengers] = useState(savedData.passengers || 1);
  const [error, setError] = useState(""); // State for error message

  const navigate = useNavigate();

  useEffect(() => {
    // Save form data to localStorage whenever there's a change
    localStorage.setItem("flightSearchData", JSON.stringify({ from, to, departureDate, returnDate, passengers }));
  }, [from, to, departureDate, returnDate, passengers]);

  const handleSearch = () => {
    const currentDate = new Date().toISOString().split("T")[0];

    // Validate form data
    if (!from || !to || !departureDate || !passengers) {
      setError("All fields are required.");
      return;
    }

    if (departureDate < currentDate) {
      setError("Departure date cannot be in the past.");
      return;
    }

    if (returnDate && returnDate <= departureDate) {
      setError("Return date must be later than the departure date.");
      return;
    }

    // Clear error if everything is valid
    setError("");

    // Navigate to the available flights page with the valid data
    navigate("/available-flights", {
      state: { from, to, departureDate, returnDate, passengers },
    });
  };

  return (
    <div className="flight-booking-container">
      <h2>Book Your Flight</h2>
      <div className="flight-booking-form">
        <div className="form-group">
          <label>From:</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            <option value="" disabled>Select Departure City</option>
            <option value="New York">New York</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Chicago">Chicago</option>
            <option value="Houston">Houston</option>
            <option value="Miami">Miami</option>
          </select>
        </div>
        <div className="form-group">
          <label>To:</label>
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            <option value="" disabled>Select Destination City</option>
            <option value="London">London</option>
            <option value="Paris">Paris</option>
            <option value="Tokyo">Tokyo</option>
            <option value="Dubai">Dubai</option>
            <option value="Sydney">Sydney</option>
          </select>
        </div>
        <div className="form-group">
          <label>Departure Date:</label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="form-group">
          <label>Return Date:</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={departureDate}
          />
        </div>
        <div className="form-group">
          <label>Passengers:</label>
          <input
            type="number"
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            min="1"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="button-container">
        <button className="search-button" onClick={handleSearch}>
          Search Flights
        </button>
      </div>
    </div>
  );
};

export default FlightBooking;
