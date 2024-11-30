import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS Components/bookFlights CSS/flightBooking.css';
import { FaExchangeAlt } from "react-icons/fa";

const FlightBooking = () => {
  const savedData = JSON.parse(localStorage.getItem("flightSearchData")) || {};

  const [flightType, setFlightType] = useState(savedData.flightType || "one-way");
  const [from, setFrom] = useState(savedData.from || "");
  const [to, setTo] = useState(savedData.to || "");
  const [departureDate, setDepartureDate] = useState(savedData.departureDate || "");
  const [returnDate, setReturnDate] = useState(savedData.returnDate || "");
  const [passengerCounts, setPassengerCounts] = useState({
    adult: savedData.passengerCounts?.adult || 1,
    children: savedData.passengerCounts?.children || 0,
    infant: savedData.passengerCounts?.infant || 0,
  });
  const [classType, setClassType] = useState(savedData.classType || "economy");
  const [error, setError] = useState("");
  const [showPassengerSelector, setShowPassengerSelector] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(
      "flightSearchData",
      JSON.stringify({ flightType, from, to, departureDate, returnDate, passengerCounts, classType })
    );
  }, [flightType, from, to, departureDate, returnDate, passengerCounts, classType]);

  // Retrieve all flight data from localStorage
  const storedFlights = JSON.parse(localStorage.getItem("flights")) || [];

  // Extract unique cities from stored flight data
  const uniqueCities = [
    ...new Set([
      ...storedFlights.flatMap((flight) => [flight.from, flight.to]),
    ]),
  ];

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
  
    // Ensure departure and destination cities are not the same
    if (from === to) {
      setError("Departure city and destination city cannot be the same.");
      return;
    }
  
    // Calculate total passengers
    const totalPassengers = passengerCounts.adult + passengerCounts.children + passengerCounts.infant;
  
    // Find flights matching the search criteria
    const flight = storedFlights.find(
      (flight) =>
        flight.from === from &&
        flight.to === to &&
        flight.date === departureDate &&
        flight.currentPassengers + totalPassengers <= flight.maximumPassengers // Check passenger capacity
    );
  
    // If no flights are found or capacity is insufficient, navigate to an appropriate page
    if (!flight) {
      const message = "No available flights match your preferences or passenger count exceeds flight capacity.";
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
        state: { flightType, from, to, departureDate, returnDate, passengerCounts, classType },
      });
    } else {
      navigate("/display-flight-return", {
        state: { flightType, from, to, departureDate, returnDate, passengerCounts, classType },
      });
    }
  };
  

  const handlePassengerCountChange = (type, change) => {
    setPassengerCounts((prevCounts) => {
      const newCounts = { ...prevCounts };
      
      // Calculate the total number of passengers (adults, children, infants)
      const totalPassengers = newCounts.adult + newCounts.children + newCounts.infant;
  
      // Find the selected flight based on the 'from' and 'to' cities and the 'departureDate'
      const selectedFlight = storedFlights.find(
        (flight) =>
          flight.from === from &&
          flight.to === to &&
          flight.date === departureDate
      );
  
      if (selectedFlight) {
        // Check if we are exceeding the maximum number of passengers allowed
        const availableSeats = selectedFlight.maximumPassengers - selectedFlight.currentPassengers;
        
        // If the total passengers after change exceeds the available seats, prevent the change
        if (totalPassengers + change <= availableSeats && totalPassengers + change >= 0) {
          newCounts[type] = Math.max(0, newCounts[type] + change);
        }
      }
  
      // Ensure that there is at least one adult if there are children or infants
      if ((type === "children" || type === "infant") && newCounts[type] > 0) {
        newCounts.adult = Math.max(1, newCounts.adult);
      }
  
      return newCounts;
    });
  };
  

  const confirmPassengers = () => {
    setShowPassengerSelector(false);
  };

  const totalPassengers = passengerCounts.adult + passengerCounts.children + passengerCounts.infant;

  const handleSwitch = () => {
    setFrom(to);
    setTo(from);
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
              <select value={from} onChange={(e) => setFrom(e.target.value)}>
                <option value="" disabled>Select Departure City</option>
                {uniqueCities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <button className="switch-button" onClick={handleSwitch}>
              <FaExchangeAlt />
            </button>

            <div className="form-group">
              <label>To:</label>
              <select value={to} onChange={(e) => setTo(e.target.value)}>
                <option value="" disabled>Select Destination City</option>
                {filteredToCities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
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
                  min={new Date(new Date(departureDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                />
              </div>
            )}

            <div className="form-group">
              <label>Passengers:</label>
              <div className="dropdown">
                <button onClick={() => setShowPassengerSelector(!showPassengerSelector)} className="dropdown-toggle">
                  {`${totalPassengers} ${totalPassengers === 1 ? "Passenger" : "Passengers"} ${classType.charAt(0).toUpperCase() + classType.slice(1)}`}
                </button>

                {showPassengerSelector && (
                  <div className="passenger-selector">
                    {["adult", "children", "infant"].map((type) => (
                      <div className="passenger-type" key={type}>
                        <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        <div>
                          <button onClick={() => handlePassengerCountChange(type, -1)}>-</button>
                          <span>{passengerCounts[type]}</span>
                          <button onClick={() => handlePassengerCountChange(type, 1)}>+</button>
                        </div>
                      </div>
                    ))}
                    <div className="form-group">
                      <label>Class Type:</label>
                      <select value={classType} onChange={(e) => setClassType(e.target.value)}>
                        <option value="economy">Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First Class</option>
                      </select>
                    </div>
                    <div className="confirm-button-container">
                      <button onClick={confirmPassengers} className="confirm-button">Confirm</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
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

export default FlightBooking;
