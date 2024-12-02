import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from '../accountControl/authContext'; // Adjust the import path accordingly
import '../../CSS Components/bookFlights CSS/seatSelection.css';

const SeatSelection = () => {
  const location = useLocation(); // Access the location object
  const navigate = useNavigate(); // Initialize useNavigate
  const { username } = useAuth(); // Get the username from the auth context
  const bookingDetails = location.state?.bookingDetails; // Get booking details from state
  const [seats, setSeats] = useState(
    Array(5)
      .fill()
      .map(() => Array(6).fill(false)) // Premium Class Seats
      .concat(
        Array(28)
          .fill()
          .map(() => Array(6).fill(false)) // Economy Class Seats
      )
  );

  const [showLoginModal, setShowLoginModal] = useState(false); // State for modal visibility

  // Log booking details for debugging
  useEffect(() => {
    console.log("Booking Details in SeatSelection:", bookingDetails);
  }, [bookingDetails]);

  const toggleSeat = (row, col) => {
    const updatedSeats = [...seats]; // Create a copy of the seats array
    const isSelected = updatedSeats[row][col]; // Check if the seat is currently selected

    // If the seat is already selected, deselect it
    if (isSelected) {
      updatedSeats[row][col] = false; // Deselect the seat
    } else {
      // If the seat is not selected and we haven't reached the passenger limit, select it
      if (selectedSeats < totalPassengers) {
        updatedSeats[row][col] = true; // Select the seat
      } else {
        alert("You can only select up to " + totalPassengers + " seats.");
        return; // Prevent further action if limit is reached
      }
    }

    setSeats(updatedSeats); // Update state with the modified array
  };

  const selectedSeats = seats.flat().filter((seat) => seat).length;
  const columns = ["A", "B", "C", "H", "J", "K"];
  const totalPassengers = bookingDetails?.adults + bookingDetails?.children + bookingDetails?.infants;
  const isPremiumClass = bookingDetails?.cabinClass === "Premium";

  const getSeatCode = (rowIndex, colIndex) => {
    const rowNumber = rowIndex + 1;
    const seatLetter = columns[colIndex];
    return `${rowNumber}${seatLetter}`;
  };

  const generateBookingCode = () => {
    const lastBookingNumber = parseInt(localStorage.getItem('lastBookingNumber')) || 0;
    const newBookingNumber = lastBookingNumber + 1; // Increment the booking number
    const bookingCode = `BK-${String(newBookingNumber).padStart(8, '0')}`; // BK-00000001 format
    localStorage.setItem('lastBookingNumber', newBookingNumber);
    return bookingCode;
  };

  const handleSubmit = () => {
    if (!username) {
      setShowLoginModal(true); // Show modal if user is not logged in
      return;
    }

    const selectedSeatsData = [];
    seats.forEach((row, rowIndex) => {
      row.forEach((seat, colIndex) => {
        if (seat) {
          const seatCode = getSeatCode(rowIndex, colIndex);
          selectedSeatsData.push(seatCode);
        }
      });
    });

    const bookingCode = generateBookingCode();

    const bookingToSave = {
      bookingCode,
      selectedSeats: selectedSeatsData,
      flightDetails: {
        flightNumber: bookingDetails.flightNumber,
        from: bookingDetails.from,
        to: bookingDetails.to,
        departureDate: bookingDetails.departureDate,
        departureTime: bookingDetails.departureTime,
        arrivalTime: bookingDetails.arrivalTime,
        cabinClass: bookingDetails.cabinClass,
        totalPassengers: totalPassengers,
        adults: bookingDetails.adults,
        children: bookingDetails.children,
        infants: bookingDetails.infants,
      }
    };

    let existingBookings = JSON.parse(localStorage.getItem(`${username}Booking`)) || [];
    existingBookings.push(bookingToSave);
    localStorage.setItem(`${username}Booking`, JSON.stringify(existingBookings));
    alert(`Your selected seats have been successfully submitted! Your booking code is: ${bookingCode}`);
    const flightKey = `${bookingDetails.flightNumber}-${bookingDetails.departureDate}`;
    const existingFlights = JSON.parse(localStorage.getItem('flights')) || {};

    // Initialize flight details if it doesn't exist
    if (!existingFlights[flightKey]) {
      existingFlights[flightKey] = {
        flightNumber: bookingDetails.flightNumber,
        from: bookingDetails.from,
        to: bookingDetails.to,
        date: bookingDetails.departureDate,
        departureTime: bookingDetails.departureTime,
        arrivalTime: bookingDetails.arrivalTime,
        occupiedEconomySeats: [],
        occupiedPremiumSeats: [],
        currentPassengerCount: 0,
        maximumPassengers: 198, // Set this to the actual maximum
        classTypes: ["Economy", "Premium"],
        occupiedSeats: []
      };
    }

    // Update current passenger count
    existingFlights[flightKey].currentPassengerCount += totalPassengers;

    // Update occupied seats based on selected seats
    if (isPremiumClass) {
      existingFlights[flightKey].occupiedPremiumSeats.push(...selectedSeatsData);
    } else {
      existingFlights[flightKey].occupiedEconomySeats.push(...selectedSeatsData);
    }

    // Save the updated flights data back to local storage
    localStorage.setItem('flights', JSON.stringify(existingFlights));
  };

  const handleBack = () => {
    navigate('/search-flights');
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false); // Close the modal
    navigate('/log-in'); // Redirect to login page
  };

  return (
    <div className="seat-selection-container">
      <div className="header-container">
        <h2 className="seat-selection-title">Seat Selection</h2>
      </div>

      <div className="flight-details">
        <h3>Flight Details</h3>
        <p><strong>Flight Number:</strong> {bookingDetails?.flightNumber}</p>
        <p><strong>From:</strong> {bookingDetails?.from}</p>
        <p><strong>To:</strong> {bookingDetails?.to}</p>
        <p><strong>Departure Date:</strong> {bookingDetails?.departureDate}</p>
        <p><strong>Departure Time:</strong> {bookingDetails?.departureTime}</p>
        <p><strong>Arrival Time:</strong> {bookingDetails?.arrivalTime}</p>
      </div>

      {isPremiumClass && (
        <div className="premium-seat-grid">
          <h3 className="premium-text">Premium Class</h3>
          {seats.slice(0, 5).map((row, rowIndex) => (
            <div key={rowIndex} className="seat-row premium-row">
              {row.map((seat, colIndex) => (
                <React.Fragment key={colIndex}>
                  {colIndex === 3 && <div className="aisle-space"></div>}
                  <button
                    className={`seat-button premium ${seat ? "selected" : ""}`}
                    onClick={() => toggleSeat(rowIndex, colIndex)}
                  >
                    {getSeatCode(rowIndex, colIndex)}
                  </button>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      )}

      {!isPremiumClass && (
        <div className="economy-seat-grid">
          <h3 className="economy-text">Economy Class</h3>
          {seats.slice(5).map((row, rowIndex) => (
            <div key={rowIndex + 5} className="seat-row">
              {row.map((seat, colIndex) => (
                <React.Fragment key={colIndex}>
                  {colIndex === 3 && <div className="aisle-space"></div>}
                  <button
                    className={`seat-button economy ${seat ? "selected" : ""}`}
                    onClick={() => toggleSeat(rowIndex + 5, colIndex)}
                  >
                    {getSeatCode(rowIndex + 5, colIndex)}
                  </button>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="footer-container">
        <p>Selected Seats: {selectedSeats} / {totalPassengers}</p>
        <button className="submit-button" onClick={handleSubmit}>
          Submit Selected Seats
        </button>
        <button className="back-button" onClick={handleBack}>
          Back to Search Flights
        </button>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Please Log In</h3>
            <p>You need to log in to submit your booking.</p>
            <button onClick={handleLoginRedirect}>Go to Login</button>
            <button onClick={() => setShowLoginModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;