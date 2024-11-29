import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "../CSS Components/seatSelection.css"; // Import the CSS file for styling

const SeatSelection = () => {
  const [passengerCount, setPassengerCount] = useState(0); // State to hold total passenger count
  const [seats, setSeats] = useState(
    // Initialize seat grid with 5 premium class rows and 28 economy class rows
    Array(5)
      .fill()
      .map(() => Array(6).fill(false)) // Premium class rows
      .concat(
        Array(28)
          .fill()
          .map(() => Array(6).fill(false)) // Economy class rows
      )
  );

  const navigate = useNavigate(); // Create a navigate instance

  // Retrieve passengerCount from localStorage when the component mounts
  useEffect(() => {
    const flightSearchData = JSON.parse(localStorage.getItem("flightSearchData"));
    if (flightSearchData && flightSearchData.passengerCounts) {
      // Calculate total passengers by summing adult, children, and infant counts
      const { adult, children, infant } = flightSearchData.passengerCounts;
      setPassengerCount(adult + children + infant);
    }
  }, []);

  // Function to toggle seat selection
  const toggleSeat = (row, col) => {
    const updatedSeats = [...seats];
    const seatSelected = updatedSeats[row][col];

    // If the seat is being selected, check if we can select more
    const selectedSeats = updatedSeats.flat().filter((seat) => seat).length;

    // Only allow selecting a seat if the number of selected seats is less than the total passenger count
    if (!seatSelected && selectedSeats >= passengerCount) {
      return; // Prevent selecting more seats
    }

    updatedSeats[row][col] = !seatSelected;
    setSeats(updatedSeats);
  };

  // Calculate the total selected seats
  const selectedSeats = seats.flat().filter((seat) => seat).length;

  const columns = ["A", "B", "C", "H", "J", "K"]; // Seat labels

  return (
    <div className="seat-selection-container">
      <div className="header-container">
        {/* Back button */}
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>

        {/* Seat selection title */}
        <h2 className="seat-selection-title">Seat Selection</h2>
      </div>


      {/* Render the premium class (first 5  rows) */}
      <div className="premium-seat-grid">
        <h3 className="premium-text">Premium Class</h3>
        {seats.slice(0, 5).map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row premium-row">
            {/* Row number on the left */}
            <div className="row-number">{rowIndex + 1}</div>

            {row.map((seat, colIndex) => (
              <React.Fragment key={colIndex}>
                {colIndex === 3 && <div className="aisle-space"></div>}
                <button
                  className={`seat-button premium ${seat ? "selected" : ""}`}
                  onClick={() => toggleSeat(rowIndex, colIndex)}
                  disabled={seat ? false : selectedSeats >= passengerCount}
                >
                  {columns[colIndex]}
                </button>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      {/* Render the economy class (rows 6 to 28) */}
      <div className="economy-seat-grid">
        <h3 className="economy-text">Economy Class</h3>
        <div className="divider-container">
          <div className="divider left-divider">Exit</div>
          <div className="divider right-divider">Exit</div>
        </div>
        {seats.slice(5, 28).map((row, rowIndex) => (
          <div key={rowIndex + 5} className="seat-row">
            {/* Row number on the left */}
            <div className="row-number">{rowIndex + 6}</div>

            {row.map((seat, colIndex) => (
              <React.Fragment key={colIndex}>
                {colIndex === 3 && <div className="aisle-space"></div>}
                <button
                  className={`seat-button ${seat ? "selected" : ""}`}
                  onClick={() => toggleSeat(rowIndex + 5, colIndex)}
                  disabled={seat ? false : selectedSeats >= passengerCount}
                >
                  {columns[colIndex]}
                </button>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      {/* Divider at the end */}
      <div className="divider-container2">
        <div className="divider2 left-divider2">Exit</div>
        <div className="divider2 right-divider2">Exit</div>
      </div>

      <p className="selected-count">Total Selected Seats: {selectedSeats}</p>

      {/* Submit button */}
      <button
        className="submit-button"
        onClick={() => alert("Submit button clicked!")}
      >
        Submit booking
      </button>
    </div>
  );
};

export default SeatSelection;
