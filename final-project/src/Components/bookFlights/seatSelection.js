import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Components/accountControl/authContext"; // Import useAuth hook
import '../../CSS Components/bookFlights CSS/seatSelection.css';

const SeatSelection = () => {
  const { isLoggedIn, username } = useAuth(); // Access auth state
  const [passengerCount, setPassengerCount] = useState(0);
  const [seats, setSeats] = useState(
    Array(5)
      .fill()
      .map(() => Array(6).fill(false))
      .concat(
        Array(33)
          .fill()
          .map(() => Array(6).fill(false))
      )
  );
  const [selectedClass, setSelectedClass] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  // Check login status when component mounts
  useEffect(() => {
    if (isLoggedIn) {
      setShowLoginModal(false); // If already logged in, don't show the modal
    }

    const flightSearchData = JSON.parse(localStorage.getItem("flightSearchData"));
    if (flightSearchData && flightSearchData.passengerCounts) {
      const { adult, children, infant } = flightSearchData.passengerCounts;
      setPassengerCount(adult + children + infant);
    }

    if (flightSearchData && flightSearchData.classType) {
      setSelectedClass(flightSearchData.classType); // Set the selected class based on localStorage
    }

    // Load the previously selected seats if they exist
    const flightBookingData = JSON.parse(localStorage.getItem("flightBookingData"));
    if (flightBookingData && flightBookingData.selectedSeats) {
      const updatedSeats = [...seats];
      flightBookingData.selectedSeats.forEach((seatCode) => {
        const [row, col] = getRowColFromSeatCode(seatCode); // Convert seat code to row/column
        updatedSeats[row][col] = true; // Mark the seat as selected
      });
      setSeats(updatedSeats);
    }

    // Load the occupied seats from flight data in localStorage
    const storedFlights = JSON.parse(localStorage.getItem("flights")) || [];
    const selectedFlightData = JSON.parse(localStorage.getItem("selectedFlight")) || {};
    if (selectedFlightData && selectedFlightData.flightNumber) {
      const flight = storedFlights.find(
        (flight) => flight.flightNumber === selectedFlightData.flightNumber
      );
      if (flight && flight.occupiedSeats) {
        const updatedSeats = [...seats];
        flight.occupiedSeats.forEach((seatCode) => {
          const [row, col] = getRowColFromSeatCode(seatCode);
          updatedSeats[row][col] = true; // Mark seat as occupied
        });
        setSeats(updatedSeats);
      }
    }
  }, [isLoggedIn, seats]);

  const toggleSeat = (row, col) => {
    const updatedSeats = [...seats];
    const seatSelected = updatedSeats[row][col];
    const selectedSeats = updatedSeats.flat().filter((seat) => seat).length;

    if (!seatSelected && selectedSeats >= passengerCount) {
      return; // Prevent selection if maximum passengers have been reached
    }

    updatedSeats[row][col] = !seatSelected;
    setSeats(updatedSeats);
  };

  const selectedSeats = seats.flat().filter((seat) => seat).length;

  const columns = ["A", "B", "C", "H", "J", "K"];

  const getSeatCode = (rowIndex, colIndex) => {
    const rowNumber = rowIndex + 1;
    const seatLetter = columns[colIndex];
    return `${rowNumber}${seatLetter}`;
  };

  // Convert seat code (e.g., A1, B2) to row and column indices
  const getRowColFromSeatCode = (seatCode) => {
    const row = parseInt(seatCode.slice(0, -1), 10) - 1; // Convert row (1-based) to index (0-based)
    const col = columns.indexOf(seatCode.slice(-1)); // Find column index based on seat letter
    return [row, col];
  };

  const handleSubmit = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true); // Show the modal if the user is not logged in
      return;
    }
  
    const flightSearchData = JSON.parse(localStorage.getItem("flightSearchData"));
    const selectedFlightData = JSON.parse(localStorage.getItem("selectedFlight")) || {}; // Get selected flight from localStorage if available
  
    if (flightSearchData && selectedFlightData) {
      const selectedSeatsData = [];
  
      seats.forEach((row, rowIndex) => {
        row.forEach((seat, colIndex) => {
          if (seat) {
            selectedSeatsData.push(getSeatCode(rowIndex, colIndex));
          }
        });
      });
  
      // Retrieve the current flight list from localStorage
      const storedFlights = JSON.parse(localStorage.getItem('flights')) || [];
  
      const updatedFlights = storedFlights.map((flight) => {
        if (flight.flightNumber === selectedFlightData.flightNumber) {
          // Add selected seats to the occupiedSeats array
          const updatedOccupiedSeats = flight.occupiedSeats
            ? [...flight.occupiedSeats, ...selectedSeatsData]
            : selectedSeatsData;
  
          flight.occupiedSeats = updatedOccupiedSeats; // Update the occupied seats array
        }
        return flight;
      });
  
      // Save the updated flight list back into localStorage
      localStorage.setItem('flights', JSON.stringify(updatedFlights));
  
      // Store the flight booking data with selected seats under the username
      const flightBookingData = {
        flightNumber: selectedFlightData.flightNumber, // Save flight number
        selectedSeats: selectedSeatsData,
      };
  
      // Save the booking data in localStorage using the username as the key
      localStorage.setItem(`${username}Booking`, JSON.stringify(flightBookingData));
  
      // Redirect to the ManageFlights page after booking
      navigate("/manage-flights");
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false); // Close the modal
    navigate("/log-in"); // Navigate to the login page
  };

  return (
    <div className="seat-selection-container">
      <div className="header-container">
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        <h2 className="seat-selection-title">Seat Selection</h2>
      </div>

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
                  disabled={seat || selectedClass !== "premium" || (seat ? false : selectedSeats >= passengerCount)}
                >
                  {getSeatCode(rowIndex, colIndex)}
                </button>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      <div className="economy-seat-grid">
        <h3 className="economy-text">Economy Class</h3>
        <div className="divider-container">
          <div className="divider left-divider">Exit</div>
          <div className="divider right-divider">Exit</div>
        </div>
        {seats.slice(5, 33).map((row, rowIndex) => (
          <div key={rowIndex + 5} className="seat-row">
            {row.map((seat, colIndex) => (
              <React.Fragment key={colIndex}>
                {colIndex === 3 && <div className="aisle-space"></div>}
                <button
                  className={`seat-button ${seat ? "selected" : ""}`}
                  onClick={() => toggleSeat(rowIndex + 5, colIndex)}
                  disabled={seat || selectedClass !== "economy" || (seat ? false : selectedSeats >= passengerCount)}
                >
                  {getSeatCode(rowIndex + 5, colIndex)}
                </button>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-container">
        <button className="book-button" onClick={handleSubmit}>
          Book Selected Seats ({selectedSeats} Seats)
        </button>
      </div>

      {showLoginModal && (
        <div className="login-modal">
          <div className="modal-content">
            <h3>Please log in to complete the booking.</h3>
            <button className="login-btn" onClick={handleCloseModal}>Log In</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
