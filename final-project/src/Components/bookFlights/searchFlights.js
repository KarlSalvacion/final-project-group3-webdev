import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS Components/bookFlights CSS/searchFlights.css';
import { FaExchangeAlt } from "react-icons/fa";

const SearchFlights = () => {
  const [flightType, setFlightType] = useState("one-way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [error, setError] = useState("");
  const [uniqueCities, setUniqueCities] = useState([]); // State for unique cities based on flights

  const navigate = useNavigate();

  // Fetch unique cities from localStorage on component mount
  useEffect(() => {
    const storedFlights = JSON.parse(localStorage.getItem('flights')) || [];
    const cities = new Set(); // Use a Set to ensure unique city names

    storedFlights.forEach(flight => {
      if (flight.from) cities.add(flight.from);
      if (flight.to) cities.add(flight.to);
    });

    setUniqueCities(Array.from(cities)); // Convert Set back to an array
  }, []);

  const filteredToCities = uniqueCities.filter((city) => city !== from);
  const filteredFromCities = uniqueCities.filter((city) => city !== to);

  const handleSearch = () => {
    const currentDate = new Date().toISOString().split("T")[0];

    // Check if required fields are provided
    if (!from || !to || !departureDate || (flightType === "return" && !returnDate)) {
      setError("All fields are required.");
      return;
    }

    // Ensure the departure date is not in the past
    if (departureDate < currentDate) {
      setError("Departure date cannot be in the past.");
      return;
    }

    // Ensure return date is valid if flight type is return
    if (flightType === "return" && returnDate <= departureDate) {
      setError("Return date must be after departure date.");
      return;
    }

    // Ensure departure and destination cities are not the same
    if (from === to) {
      setError("Departure city and destination city cannot be the same.");
      return;
    }

    // Find flights matching the search criteria
    const storedFlights = JSON.parse(localStorage.getItem('flights')) || [];
    const flight = storedFlights.find(
      (flight) =>
        flight.from === from &&
        flight.to === to &&
        flight.date === departureDate
    );

    // If no flights are found, navigate to an appropriate page
    if (!flight) {
      const message = "No available flights match your preferences.";
      if (flightType === "one-way") {
        navigate("/display-flight-one-way", { state: { message } });
      } else {
        navigate("/display-flight-return", { state: { message } });
      }
      return;
    }

    setError(""); // Clear any previous error message

    // Navigate to the appropriate flight display page
    if (flightType === "one-way") {
      navigate("/display-flight-one-way", {
        state: { flightType, from, to, departureDate, returnDate },
      });
    } else {
      navigate("/display-flight-return", {
        state: { flightType, from, to, departureDate, returnDate },
      });
    }
  };

  return (
    <div className="main-container">
      <div className="flight-booking-container">
        <h2>Book Your Flight</h2>
        <div className="flight-booking-form">
          <div className="form-row">
            <div className="form-group">
              <label>Flight Type:</label>
              <select value={flightType} onChange={(e) => setFlightType(e.target.value)}>
                <option value="one-way">One-way</option>
                <option value="return">Return</option>
              </select>
            </div>

            <div className="form-group">
              <label>From:</label>
              <select value={from} onChange={(e) => setFrom(e .target.value)}>
                <option value="" disabled>Select Departure City</option>
                {uniqueCities && uniqueCities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <button className="switch-button" onClick={() => { setFrom(to); setTo(from); }}>
              <FaExchangeAlt />
            </button>
            <div className="form-group">
              <label>To:</label>
              <select value={to} onChange={(e) => setTo(e.target.value)}>
                <option value="" disabled>Select Destination City</option>
                {filteredToCities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Departure Date:</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {flightType === "return" && (
              <div className="form-group">
                <label>Return Date:</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate ? new Date(new Date(departureDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0] : ""}
                  disabled={!departureDate} // Disable if departure date is empty
                />
              </div>
            )}
          </div>

          <div className="button-container">
            <div className="button-inside-container">
              <button onClick={handleSearch} className="search-button">
                Search Flights
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default SearchFlights;