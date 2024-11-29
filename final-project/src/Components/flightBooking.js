import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import flightLists from "../Data/flightsList";
import "../CSS Components/flightBooking.css";
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

  const handleSearch = () => {
    const currentDate = new Date().toISOString().split("T")[0];

    if (!from || !to || !departureDate || (flightType === "return" && !returnDate)) {
      setError("All fields are required.");
      return;
    }

    if (departureDate < currentDate) {
      setError("Departure date cannot be in the past.");
      return;
    }

    if (flightType === "return" && returnDate <= departureDate) {
      setError("Return date must be later than the departure date.");
      return;
    }

    if (from === to) {
      setError("Departure city and destination city cannot be the same.");
      return;
    }

    // Find flights based on the selected search criteria
    const flight = flightLists.find(flight => flight.from === from && flight.to === to && flight.date === departureDate);

    if (!flight) {
      if (flightType === "one-way") {
        navigate("/display-flight-one-way", {
          state: { message: "No available flights match your preferences." },
        });
      } else {
        navigate("/available-flights", {
          state: { message: "No available flights match your preferences." },
        });
      }
      return;
    }

    setError(""); // Clear any previous error message

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

  const uniqueCities = [...new Set(flightLists.flatMap((flight) => [flight.from, flight.to]))];
  const filteredToCities = uniqueCities.filter((city) => city !== from);
  const filteredFromCities = uniqueCities.filter((city) => city !== to);

  const handlePassengerCountChange = (type, change) => {
    setPassengerCounts((prevCounts) => {
      const newCounts = { ...prevCounts };
      const totalPassengers = prevCounts.adult + prevCounts.children + prevCounts.infant;

      if (totalPassengers + change >= 0 && totalPassengers + change <= 12) {
        newCounts[type] = Math.max(0, newCounts[type] + change);
      }

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
                {filteredFromCities.map((city, index) => (
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
                        <option value="premium">Premium Class</option>
                      </select>
                    </div>
                    <button className="confirm-button" onClick={confirmPassengers}>Confirm</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <button className="search-button" onClick={handleSearch}>Search Flights</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightBooking;
