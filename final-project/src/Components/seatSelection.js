import React, { useState } from 'react';
import '../CSS Components/seatSelection.css'; // Import the CSS file for styling

const SeatSelection = () => {
  // Initialize a 2D array for seats (20 rows and 9 columns)
  const [seats, setSeats] = useState(
    Array(20).fill().map(() => Array(9).fill(false))
  );

  // Function to toggle seat selection
  const toggleSeat = (row, col) => {
    const updatedSeats = [...seats];
    updatedSeats[row][col] = !updatedSeats[row][col];
    setSeats(updatedSeats);
  };

  // Calculate the total selected seats
  const selectedSeats = seats.flat().filter(seat => seat).length;

  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  return (
    <div className="seat-selection-container">
      <h2>Seat Selection</h2>
      <div className="seat-grid">
        {/* Render the column headers */}
        <div className="seat-row header-row">
          {columns.map((col, index) => (
            <div key={index} className="seat-header">{col}</div>
          ))}
        </div>
        
        {/* Render the seat grid */}
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            {row.map((seat, colIndex) => (
              <button
                key={colIndex}
                className={`seat-button ${seat ? 'selected' : ''}`}
                onClick={() => toggleSeat(rowIndex, colIndex)}
              >
                {rowIndex + 1}
              </button>
            ))}
          </div>
        ))}
      </div>
      <p className="selected-count">Total Selected Seats: {selectedSeats}</p>
    </div>
  );
};

export default SeatSelection;
