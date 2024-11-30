import React, { useState } from "react";
import '../../CSS Components/manageFlights CSS/modifySeats.css';

const ModifySeats = () => {
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


  const toggleSeat = (row, col) => {
    const updatedSeats = [...seats];
    updatedSeats[row][col] = !updatedSeats[row][col]; // Toggle the seat selection
    setSeats(updatedSeats);
  };

  const selectedSeats = seats.flat().filter((seat) => seat).length;

  const columns = ["A", "B", "C", "H", "J", "K"];

  const getSeatCode = (rowIndex, colIndex) => {
    const rowNumber = rowIndex + 1;
    const seatLetter = columns[colIndex];
    return `${rowNumber}${seatLetter}`;
  };

  return (
    <div className="modify-seat-selection-container">
      <div className="modify-header-container">
        <button className="modify-back-button" onClick={() => window.history.back()}>Back</button>
        <h2 className="modify-seat-selection-title">Seat Selection</h2>
      </div>

      <div className="modify-premium-seat-grid">
        <h3 className="modify-premium-text">Premium Class</h3>
        {seats.slice(0, 5).map((row, rowIndex) => (
          <div key={rowIndex} className="modify-seat-row modify-premium-row">
            {row.map((seat, colIndex) => (
              <React.Fragment key={colIndex}>
                {colIndex === 3 && <div className="modify-aisle-space"></div>}
                <button
                  className={`modify-seat-button modify-premium ${seat ? "selected" : ""}`}
                  onClick={() => toggleSeat(rowIndex, colIndex)}
                >
                  {getSeatCode(rowIndex, colIndex)}
                </button>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      <div className="modify-economy-seat-grid">
        <h3 className="modify-economy-text">Economy Class</h3>
        <div className="modify-divider-container">
          <div className="modify-divider modify-left-divider">Exit</div>
          <div className="modify-divider modify-right-divider">Exit</div>
        </div>
        {seats.slice(5, 33).map((row, rowIndex) => (
          <div key={rowIndex + 5} className="modify-seat-row">
            {row.map((seat, colIndex) => (
              <React.Fragment key={colIndex}>
                {colIndex === 3 && <div className="modify-aisle-space"></div>}
                <button
                  className={`modify-seat-button ${seat ? "selected" : ""}`}
                  onClick={() => toggleSeat(rowIndex + 5, colIndex)}
                >
                  {getSeatCode(rowIndex + 5, colIndex)}
                </button>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      <div className="modify-footer-container">
        <button className="modify-book-button">
          Book Selected Seats ({selectedSeats} Seats)
        </button>
      </div>
    </div>
  );
};

export default ModifySeats;
