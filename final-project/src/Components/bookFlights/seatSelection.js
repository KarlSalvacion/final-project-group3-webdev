import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../accountControl/authContext'; // Adjust the import path
import '../../CSS Components/bookFlights CSS/seatSelection.css';

const SeatSelection = () => {
  const location = useLocation(); // Access the location object
  const bookingDetails = location.state?.bookingDetails; // Get booking details from state
  const { isLoggedIn, username } = useAuth(); // Get the login state and username from the AuthContext
  const [passengerCount, setPassengerCount] = useState(bookingDetails?.totalPassengers || 0); // Set passenger count based on booking details
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

  const [showModal, setShowModal] = useState(false); // Modal visibility
  const navigate = useNavigate();

  // Log booking details for debugging
  useEffect(() => {
    console.log("Booking Details in SeatSelection:", bookingDetails);
  }, [bookingDetails]);

  // Determine the index range for premium and economy seats
  const isPremiumClass = bookingDetails?.cabinClass === "Premium";

  // Load occupied seats from local storage when the component mounts
  useEffect(() => {
    if (!bookingDetails) return; // Exit if bookingDetails is not available

    const storedFlights = JSON.parse(localStorage.getItem('flights')) || [];
    const flight = storedFlights.find(flight => flight.flightNumber === bookingDetails.flightNumber);
    
    if (flight) {
      // Check if occupiedPremiumSeats exists and is an array
      if (Array.isArray(flight.occupiedPremiumSeats)) {
        flight.occupiedPremiumSeats.forEach(seat => {
          const [row, col] = getSeatIndices(seat);
          if (row < 5) {
            seats[row][col] = true; // Premium seats
          }
        });
      }
  
      // Check if occupiedEconomySeats exists and is an array
      if (Array.isArray(flight.occupiedEconomySeats)) {
        flight.occupiedEconomySeats.forEach(seat => {
          const [row, col] = getSeatIndices(seat);
          if (row >= 5) {
            seats[row][col] = true; // Economy seats
          }
        });
      }
  
      setSeats([...seats]); // Update state to trigger re-render
    } else {
      console.error("Flight not found:", bookingDetails.flightNumber); // Log error if flight is not found
    }
  }, 
[bookingDetails.flightNumber]);

  const getSeatIndices = (seatCode) => {
    const rowNumber = parseInt(seatCode[0]) - 1; // Convert to zero-based index
    const seatLetter = seatCode[1];
    const colIndex = ["A", "B", "C", "H", "J", "K"].indexOf(seatLetter);
    return [rowNumber, colIndex];
  };

  const toggleSeat = (row, col) => {
    const updatedSeats = [...seats];
    const seatSelected = updatedSeats[row][col];
    const selectedSeats = updatedSeats.flat().filter((seat) => seat).length;

    // Allow selection if it's not selected yet and we haven't reached the max passenger count
    if (!seatSelected) {
      if (selectedSeats < passengerCount) {
        updatedSeats[row][col] = true; // Select the seat
      }
    } else {
      updatedSeats[row][col] = false; // Deselect the seat
    }

    setSeats(updatedSeats);
  };

  const selectedSeats = seats.flat().filter((seat) => seat).length;
  const columns = ["A", "B", "C", "H", "J", "K"];

  const getSeatCode = (rowIndex, colIndex) => {
    const rowNumber = rowIndex + 1;
    const seatLetter = columns[colIndex];
    return `${rowNumber}${seatLetter}`;
  };

  const generateBookingCode = () => {
    return `BK-${bookingDetails.flightNumber}-${Date.now()}`;
  };

  const handleSubmit = () => {
    if (!isLoggedIn) {
      setShowModal(true); // Show modal if not logged in
      return;
    }

    const selectedSeatsData = [];
    const occupiedPremiumSeats = [];
    const occupiedEconomySeats = [];

    seats.forEach((row, rowIndex) => {
      row.forEach((seat, colIndex) => {
        if (seat) {
          const seatCode = getSeatCode(rowIndex, colIndex);
          selectedSeatsData.push(seatCode);
          if (rowIndex < 5) {
            occupiedPremiumSeats.push(seatCode); // Premium seats
          } else {
            occupiedEconomySeats.push(seatCode); // Economy seats
          }
        }
      });
    });

    // Prepare booking details including flight information
    const bookingDetailsToSave = {
      bookingCode: generateBookingCode(), // Generate a unique booking code
      selectedSeats: selectedSeatsData,
      occupiedPremiumSeats: occupiedPremiumSeats,
      occupiedEconomySeats: occupiedEconomySeats,
      flightDetails: {
        flightNumber: bookingDetails.flightNumber, // Flight number from booking details
        departureDate: bookingDetails.departureDate, // Departure date from booking details
        cabinClass: bookingDetails.cabinClass // Cabin class from booking details
      },
      username // Save the username to ensure only they can modify it
    };

    // Retrieve existing bookings for the user
    const existingBookings = JSON.parse(localStorage.getItem(`${username}Booking`)) || [];

    // Check if the user has already booked this flight
    const isAlreadyBooked = existingBookings.some(booking => 
      booking.flightDetails.flightNumber === bookingDetails.flightNumber
    );

    if (isAlreadyBooked) {
      alert("You have already booked this flight. Please choose a different flight."); // Alert user if flight is already booked
      return;
    }

    // Add the new booking to the existing bookings
    existingBookings.push(bookingDetailsToSave);

    // Save all bookings under the username key
    localStorage.setItem(`${username}Booking`, JSON.stringify(existingBookings)); // Save updated bookings in localStorage

    // Update the flight information in localStorage
    const storedFlights = JSON.parse(localStorage.getItem('flights')) || [];
    const updatedFlights = storedFlights.map(flight => {
      if (flight.flightNumber === bookingDetails.flightNumber) {
        // Update current passenger count
        flight.currentPassengerCount = (flight.currentPassengerCount || 0) + selectedSeats;

        // Update occupied seats based on class
        if (isPremiumClass) {
          flight.occupiedPremiumSeats = (flight.occupiedPremiumSeats || []).concat(occupiedPremiumSeats);
        } else {
          flight.occupiedEconomySeats = (flight.occupiedEconomySeats || []).concat(occupiedEconomySeats);
        }
      }
      return flight;
    });

    localStorage.setItem('flights', JSON.stringify(updatedFlights)); // Save updated flights in localStorage

    console.log('Booking details saved:', bookingDetailsToSave);

    // Alert user that booking was successful
    alert("Your booking has been successfully completed!");

    navigate("/manage-fl ights");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const goToLogin = () => {
    navigate("/log-in"); // Navigate to the login page
    handleCloseModal(); // Close the modal when navigating
  };

  const goBack = () => {
    navigate("/booking-details"); // Go back to the previous page
  };

  return (
    <div className="seat-selection-container">
      <div className="header-container">
        <button className="back-button" onClick={goBack}>Back</button>
        <h2 className="seat-selection-title">Seat Selection</h2>
      </div>

      {/* Flight Details Section */}
      <div className="flight-details">
        <h3>Flight Details</h3>
        <p><strong>Flight Number:</strong> {bookingDetails?.flightNumber}</p>
        <p><strong>From:</strong> {bookingDetails?.from}</p>
        <p><strong>To:</strong> {bookingDetails?.to}</p>
        <p><strong>Departure Date:</strong> {bookingDetails?.departureDate}</p>
      </div>

      {isPremiumClass && (
        <div className="premium-seat-grid">
          <h3 className="premium-text">Premium Class</h3>
          {seats.slice(0, 5).map((row, rowIndex) => (
            <div key={rowIndex} className="seat-row premium-row">
              {row.map((seat, colIndex) => (
                <React.Fragment key={colIndex}>
                  {colIndex === 3 && <div className="aisle-space"></div>}
                  <button className={`seat-button premium ${seat ? "selected occupied" : ""}`}
                    onClick={() => !seat && toggleSeat(rowIndex, colIndex)} // Disable click if seat is occupied
                    disabled={seat} // Disable button if seat is occupied
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
                    className={`seat-button economy ${seat ? "selected occupied" : ""}`}
                    onClick={() => !seat && toggleSeat(rowIndex + 5, colIndex)} // Disable click if seat is occupied
                    disabled={seat} // Disable button if seat is occupied
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
        <button className="book-button" onClick={handleSubmit}>
          Book Selected Seats ({selectedSeats} Seats)
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Please Log In</h3>
            <p>You need to be logged in to book seats.</p>
            <button className="modal-button" onClick={goToLogin}>Go to Login</button>
            <button className="modal-button" onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;