import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { useAuth } from '../accountControl/authContext'; 
import '../../CSS Components/bookFlights CSS/seatSelection.css';

const SeatSelection = () => {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const { username } = useAuth(); 
  const bookingDetails = location.state?.bookingDetails; 
  const [seats, setSeats] = useState(
    Array(5)
      .fill()
      .map(() => Array(6).fill(false)) 
      .concat(
        Array(28)
          .fill()
          .map(() => Array(6).fill(false)) 
      )
  );

  const [showLoginModal, setShowLoginModal] = useState(false); 
  const [showSubmissionModal, setShowSubmissionModal] = useState(false); // State for submission modal visibility
  const [bookingCode, setBookingCode] = useState(""); // State to hold the generated booking code
  const [occupiedSeats, setOccupiedSeats] = useState([]); 
  const [occupiedEconomySeats, setOccupiedEconomySeats] = useState([]); 
  const [occupiedPremiumSeats, setOccupiedPremiumSeats] = useState([]); 

  useEffect(() => {
    console.log("Booking Details in SeatSelection:", bookingDetails);
  }, [bookingDetails]);

  useEffect(() => {
    const flightKey = `${bookingDetails.flightNumber}-${bookingDetails.departureDate}`;
    const existingFlights = JSON.parse(localStorage.getItem('flights')) || {};
    const flightDetails = existingFlights[flightKey];

    if (flightDetails) {
      if (bookingDetails.cabinClass === "Premium") {
        setOccupiedSeats(flightDetails.occupiedPremiumSeats);
        setOccupiedPremiumSeats(flightDetails.occupiedPremiumSeats);
      } else {
        setOccupiedSeats(flightDetails.occupiedEconomySeats);
        setOccupiedEconomySeats(flightDetails.occupiedEconomySeats);
      }
    }
  }, [bookingDetails]);

  const toggleSeat = (row, col) => {
    const updatedSeats = [...seats]; 
    const isSelected = updatedSeats[row][col]; 

    if (isSelected) {
      updatedSeats[row][col] = false; 
    } else {
      if (selectedSeats < totalPassengers) {
        updatedSeats[row][col] = true; 
      } else {
        alert("You can only select up to " + totalPassengers + " seats.");
        return; 
      }
    }

    setSeats(updatedSeats); 
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
    const newBookingNumber = lastBookingNumber + 1; 
    const bookingCode = `BK-${String(newBookingNumber).padStart(8, '0')}`; 
    localStorage.setItem('lastBookingNumber', newBookingNumber);
    return bookingCode;
  };

  const handleSubmit = () => {
    if (selectedSeats !== totalPassengers) {
      alert(`You must select exactly ${totalPassengers} seats.`);
      return; 
    }

    if (!username) {
      setShowLoginModal(true); 
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
    setBookingCode(bookingCode); 

    // Save booking logic here...

    setShowSubmissionModal(true); 
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false); 
    navigate('/log-in'); 
  };

  const isSeatOccupied = (row, col) => {
    const seatCode = getSeatCode(row, col);
    return occupiedSeats.includes(seatCode);
  };

  return (
    <div className="seat-selection-container">
      <div className="header-container">
        <h2 className="seat-selection-title">Seat Selection</h2>
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
                    className={`seat-button premium ${seat ? "selected" : ""} ${isSeatOccupied(rowIndex, colIndex) ? "occupied" : ""}`}
                    onClick={() => !isSeatOccupied(rowIndex, colIndex) && toggleSeat(rowIndex, colIndex)}
                    disabled={isSeatOccupied(rowIndex, colIndex)} 
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
                    className={`seat-button economy ${seat ? "selected" : ""} ${isSeatOccupied(rowIndex + 5, colIndex) ? "occupied" : ""}`}
                    onClick={() => !isSeatOccupied(rowIndex + 5, colIndex) && toggleSeat(rowIndex + 5, colIndex)}
                    disabled={isSeatOccupied(rowIndex + 5, colIndex)} 
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
        <p className="selected-seats-text">Selected Seats: {selectedSeats} / {totalPassengers}</p>
        <button className="submit-button" onClick={handleSubmit}>
          Submit Selected Seats
        </button>
        <button className="back-button" onClick={handleBack}>
          Back to Booking Details
        </button>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Please Log In</h3>
            <p>You need to log in to submit your booking.</p>
            <button onClick={handleLoginRedirect} className="modal-log-in-button">Go to Login</button>
            <button onClick={() => setShowLoginModal(false)} className="modal-cancel-button">Cancel</button>
          </div>
        </div>
      )}

      {/* Submission Modal */}
      {showSubmissionModal && (
        <div className="submission-modal">
          <div className="submission-modal-content">
            <h3>Booking Successful!</h3>
            <p>Your selected seats have been successfully submitted!</p>
            <p>Your booking code is: <strong>{bookingCode}</strong></p>
            <button onClick={() => setShowSubmissionModal(false)} className="modal-close-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;