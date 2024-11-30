import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../Admin CSS Components/manageSeats CSS/adminSeatSelection.css';

const AdminSeatSelection = () => {
  const [seats, setSeats] = useState(
    Array(5)
      .fill()
      .map(() => Array(6).fill(false)) // Premium class rows
      .concat(
        Array(33)
          .fill()
          .map(() => Array(6).fill(false)) // Economy class rows
      )
  );
  const [flightNumber, setFlightNumber] = useState("");
  const [flightSelected, setFlightSelected] = useState(false); // Track if flight is selected
  const navigate = useNavigate();

  useEffect(() => {
    // Load seat data from localStorage on initial render
    const savedSeats = JSON.parse(localStorage.getItem("seats"));
    if (savedSeats) {
      setSeats(savedSeats);
    }
  }, []);

  const toggleSeat = (row, col) => {
    const updatedSeats = [...seats];
    updatedSeats[row][col] = !updatedSeats[row][col];
    setSeats(updatedSeats);
  };

  const saveChanges = () => {
    // Save the seat data to localStorage
    localStorage.setItem("seats", JSON.stringify(seats));
    alert("Seat changes saved!");
  };

  const columns = ["A", "B", "C", "H", "J", "K"];

  const getSeatCode = (rowIndex, colIndex) => {
    const rowNumber = rowIndex + 1;
    const seatLetter = columns[colIndex];
    return `${rowNumber}${seatLetter}`;
  };

  const handleFlightSubmit = () => {
    // You can add further validation to ensure a valid flight number is entered
    if (flightNumber.trim()) {
      setFlightSelected(true);
    } else {
      alert("Please enter a valid flight number.");
    }
  };

  if (!flightSelected) {
    return (
      <div className="admin-flight-selection-container">
        <h2 className="admin-flight-selection-title">Select Flight to Manage Seats</h2>
        <div className="admin-search-container">
          <input
            type="text"
            placeholder="Enter Flight Number"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            className="admin-search-input"
          />
          <button className="admin-search-button" onClick={handleFlightSubmit}>
            Select Flight
          </button>
        </div>
      </div>
    );
  }
  

  return (
    <div className="admin-seat-selection-container">
      <div className="admin-header-container">
        <button className="admin-back-button" onClick={() => navigate(-1)}>
          Back
        </button>
        <h2 className="admin-seat-selection-title">Admin Seat Selection</h2>
      </div>

      {/* Save Changes Button */}
      <button className="admin-save-button" onClick={saveChanges}>
        Save Changes
      </button>

      {/* Premium Class */}
      <div className="admin-premium-seat-grid">
        <h3 className="admin-premium-text">Premium Class</h3>
        {seats.slice(0, 5).map((row, rowIndex) => (
          <div key={rowIndex} className="admin-seat-row admin-premium-row">
            {row.map((seat, colIndex) => (
              <React.Fragment key={colIndex}>
                {colIndex === 3 && <div className="admin-aisle-space"></div>}
                <button
                  className={`admin-seat-button admin-premium ${seat ? "admin-occupied" : ""}`}
                  onClick={() => toggleSeat(rowIndex, colIndex)}
                >
                  {getSeatCode(rowIndex, colIndex)}
                </button>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      {/* Economy Class */}
      <div className="admin-economy-seat-grid">
        <h3 className="admin-economy-text">Economy Class</h3>
        <div className="admin-divider-container">
          <div className="admin-divider admin-left-divider">Exit</div>
          <div className="admin-divider admin-right-divider">Exit</div>
        </div>

        {seats.slice(5, 33).map((row, rowIndex) => (
          <div key={rowIndex + 5} className="admin-seat-row">
            {row.map((seat, colIndex) => (
              <React.Fragment key={colIndex}>
                {colIndex === 3 && <div className="admin-aisle-space"></div>}
                <button
                  className={`admin-seat-button ${seat ? "admin-occupied" : ""}`}
                  onClick={() => toggleSeat(rowIndex + 5, colIndex)}
                >
                  {getSeatCode(rowIndex + 5, colIndex)}
                </button>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      <div className="admin-divider-container2">
        <div className="admin-divider2 admin-left-divider2">Exit</div>
        <div className="admin-divider2 admin-right-divider2">Exit</div>
      </div>

      <p className="admin-selected-count">Total Occupied Seats: {seats.flat().filter((seat) => seat).length}</p>
    </div>
  );
};

export default AdminSeatSelection;
