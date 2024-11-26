import React, { useState } from 'react';
import '../CSS Components/flightBooking.css'; 

const FlightBooking = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [message, setMessage] = useState('');

    const handleSearch = () => {
        // Create a flight object
        const flightDetails = {
            from,
            to,
            departureDate,
            returnDate,
            passengers
        };

        // Save flight details to local storage
        localStorage.setItem('flightDetails', JSON.stringify(flightDetails));

        // Provide feedback to the user
        setMessage('Flight details saved successfully!');

        // Optionally, log the details to the console
        console.log('Flight details saved:', flightDetails);
    };

    return (
        <div className="flight-booking-container">
            <h2>Book Your Flight</h2>
            <div className="flight-booking-form">
                <div className="form-group">
                    <label>From:</label>
                    <select value={from} onChange={(e) => setFrom(e.target.value)}>
                        <option value="" disabled>Select Departure City</option>
                        <option value="New York">New York</option>
                        <option value="Los Angeles">Los Angeles</option>
                        <option value="Chicago">Chicago</option>
                        <option value="Houston">Houston</option>
                        <option value="Miami">Miami</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>To:</label>
                    <select value={to} onChange={(e) => setTo(e.target.value)}>
                        <option value="" disabled>Select Destination City</option>
                        <option value="London">London</option>
                        <option value="Paris">Paris</option>
                        <option value="Tokyo">Tokyo</option>
                        <option value="Dubai">Dubai</option>
                        <option value="Sydney">Sydney</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Departure Date:</label>
                    <input 
                        type="date" 
                        value={departureDate} 
                        onChange={(e) => setDepartureDate(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>Return Date:</label>
                    <input 
                        type="date" 
                        value={returnDate} 
                        onChange={(e) => setReturnDate(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>Passengers:</label>
                    <input 
                        type="number" 
                        value={passengers} 
                        onChange={(e) => setPassengers(e.target.value)} 
                        min="1" 
                    />
                </div>
            </div>
            <div className="button-container">
                <button className="search-button" onClick={handleSearch}>Search Flights</button>
            </div>
            {message && <div className="message">{message}</div>} {/* Display feedback message */}
        </div>
    );
};

export default FlightBooking;