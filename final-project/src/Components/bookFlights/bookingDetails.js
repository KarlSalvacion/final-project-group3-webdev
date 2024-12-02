import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../CSS Components/bookFlights CSS/bookingDetails.css"; // Add your CSS file for styling

const BookingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Access the location object
  const departureFlight = location.state?.departureFlight; // Get the selected flight from state

  const [adultCount, setAdultCount] = useState(1); // Default to 1 adult
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [cabinClass, setCabinClass] = useState("Economy"); // Default to Economy

  // Calculate total cost based on passenger counts and cabin class
  const calculateTotalCost = () => {
    const adultPrice = cabinClass === "Economy" ? departureFlight.economyPrice : departureFlight.premiumPrice;
    const childPrice = cabinClass === "Economy" ? departureFlight.economyPrice * 0.5 : departureFlight.premiumPrice * 0.5; // Assuming children pay half price
    const infantPrice = 0; // Infants are usually free or have no charge

    const totalCost =
      adultCount * adultPrice +
      childCount * childPrice +
      infantCount * infantPrice;

    return totalCost.toFixed(2); // Return total cost formatted to 2 decimal places
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create an object to hold the booking details
    const bookingDetails = {
      adults: adultCount,
      children: childCount,
      infants: infantCount,
      cabinClass,
      flightNumber: departureFlight.flightNumber, // Include flight number
      departureDate: departureFlight.date, // Include departure date
      from: departureFlight.from, // Include departure location
      to: departureFlight.to, // Include arrival location
      departureTime: departureFlight.departureTime, // Include departure time
      arrivalTime: departureFlight.arrivalTime, // Include arrival time
      totalCost: calculateTotalCost(), // Add total cost to booking details
    };

    // Calculate total passengers
    const totalPassengers = adultCount + childCount + infantCount;

    // Navigate to the seat selection with total passengers and cost
    navigate("/seat-selection", {
      state: {
        bookingDetails: {
          ...bookingDetails,
          totalPassengers, // Pass total passengers to the next component
        },
      },
    });
  };

  const handleBack = () => {
    navigate("/search-flights");
  };

  return (
    <div className="booking-details-container">
      <h2>Booking Details</h2>
      
      {/* Display Flight Information */}
      {departureFlight ? (
        <div className="flight-info">
          <h3>Selected Flight Information:</h3>
          <p><strong>Flight Number:</strong> {departureFlight.flightNumber}</p>
          <p><strong>From:</strong> {departureFlight.from}</p>
          <p><strong>To:</strong> {departureFlight.to}</p>
          <p><strong>Date:</strong> {departureFlight.date}</p> {/* Display only the date */}
          <p><strong>Departure Time:</strong> {departureFlight.departureTime}</p>
          <p><strong>Arrival Time:</strong> {departureFlight.arrivalTime}</p>
          <p><strong>Current Passengers:</strong> {departureFlight.currentPassengerCount || 0}</p>
          <p><strong>Economy Price:</strong> ${departureFlight.economyPrice}</p>
          <p><strong>Premium Price:</strong> ${departureFlight.premiumPrice}</p>
          <p><strong>Total Cost:</strong> ${calculateTotalCost()}</p> {/* Display total cost */}
          {/* Add more fields as necessary */}
        </div>
      ) : (
        <p>No flight selected. Please go back and select a flight.</p>
      )}

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="passenger-count">
          <label>
            Adults (12+ years):
            <input type="number"
              min="1"
              value={adultCount}
              onChange={(e) => setAdultCount(Number(e.target.value))}
              className="input-field"
            />
          </label>
          <label>
            Children (2-11 years):
            <input
              type="number"
              min="0"
              value={childCount}
              onChange={(e) => setChildCount(Number(e.target.value))}
              className="input-field"
            />
          </label>
          <label>
            Infants (0-2 years):
            <input
              type="number"
              min="0"
              value={infantCount}
              onChange={(e) => setInfantCount(Number(e.target.value))}
              className="input-field"
            />
          </label>
        </div>
        <div className="cabin-class">
          <label>
            Cabin Class:
            <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value)} className="select-field">
              <option value="Economy">Economy</option>
              <option value="Premium">Premium</option>
            </select>
          </label>
        </div>
        <button type="submit" className="submit-button">Proceed to Seat Selection</button>
      </form>
      <button onClick={handleBack} className="back-button">Back to Search Flights</button>
    </div>
  );
};

export default BookingDetails;