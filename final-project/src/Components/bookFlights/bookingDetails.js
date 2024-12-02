import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../CSS Components/bookFlights CSS/bookingDetails.css"; // Add your CSS file for styling

const BookingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const departureFlight = location.state?.departureFlight;

  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [cabinClass, setCabinClass] = useState("Economy");

  const calculateTotalCost = () => {
    const adultPrice = cabinClass === "Economy" ? departureFlight.economyPrice : departureFlight.premiumPrice;
    const childPrice = cabinClass === "Economy" ? departureFlight.economyPrice * 0.5 : departureFlight.premiumPrice * 0.5;
    const totalCost = adultCount * adultPrice + childCount * childPrice + infantCount * 0;
    return totalCost.toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingDetails = {
      adults: adultCount,
      children: childCount,
      infants: infantCount,
      cabinClass,
      flightNumber: departureFlight.flightNumber,
      departureDate: departureFlight.date,
      from: departureFlight.from,
      to: departureFlight.to,
      departureTime: departureFlight.departureTime,
      arrivalTime: departureFlight.arrivalTime,
      totalCost: calculateTotalCost(),
    };

    const totalPassengers = adultCount + childCount + infantCount;

    navigate("/seat-selection", {
      state: {
        bookingDetails: {
          ...bookingDetails,
          totalPassengers,
        },
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="booking-details-container">
      <button onClick={handleBack} className="booking-back-button">Back to Flight Selection</button>
      <h2 className="booking-details-title">Booking Details</h2>
      
      <div className="booking-details-content">
        {departureFlight ? (
          <div className="flight-info">
            <h3 className="flight-info-title">Selected Flight Information</h3>
            <div className="flight-info-details">
              <div className="flight-detail"><strong>Flight Number:</strong> {departureFlight.flightNumber}</div>
              <div className="flight-detail"><strong>From:</strong> {departureFlight.from}</div>
              <div className="flight-detail"><strong>To:</strong> {departureFlight.to}</div>
              <div className="flight-detail"><strong>Date:</strong> {departureFlight.date}</div>
              <div className="flight-detail"><strong>Departure Time:</strong> {departureFlight.departureTime}</div>
              <div className="flight-detail"><strong>Arrival Time:</strong> {departureFlight.arrivalTime}</div>
              <div className="flight-detail"><strong>Economy Price Per Pax:</strong> ${departureFlight.economyPrice}</div>
              <div className="flight-detail"><strong>Premium Price Per Pax:</strong> ${departureFlight.premiumPrice}</div>
              <div className="flight-detail"><strong>Total Cost:</strong> ${calculateTotalCost()}</div>
            </div>
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
              Children (2-11 years 50% discount):
              <input
                type="number"
                min="0"
                value={childCount}
                onChange={(e) => setChildCount(Number(e.target.value))}
                className="input-field"
              />
            </label>
            <label>
              Infants (0-2 years are free of charge):
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
          <button type="submit" className="proceed-submit-button">Proceed to Seat Selection</button>
        </form>
      </div>
    </div>
  );
};

export default BookingDetails;