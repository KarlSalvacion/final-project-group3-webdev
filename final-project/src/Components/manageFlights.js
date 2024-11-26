import React, { useState, useEffect } from 'react';
import '../CSS Components/manageFlights.css'; // Import the CSS file for styling

const ManageFlights = () => {
    const [flights, setFlights] = useState([]);

    // Fetch flight details from local storage when the component mounts
    useEffect(() => {
        const storedFlights = JSON.parse(localStorage.getItem('flightDetails'));
        if (storedFlights) {
            setFlights([storedFlights]); // Store in an array for consistency
        }
    }, []);

    const handleCancelFlight = () => {
        // Clear the stored flight details from local storage
        localStorage.removeItem('flightDetails');
        setFlights([]); // Update state to reflect the cancellation
    };

    return (
        <div className="manage-flights-container">
            <h2>Manage Your Flights</h2>
            <div className="flights-list">
                <h3>Your Booked Flights:</h3>
                <ul>
                    {flights.length > 0 ? (
                        flights.map((flight, index) => (
                            <li key={index}>
                                <div>
                                    <strong>From:</strong> {flight.from} <br />
                                    <strong>To:</strong> {flight.to} <br />
                                    <strong>Departure Date:</strong> {flight.departureDate} <br />
                                    <strong>Return Date:</strong> {flight.returnDate} <br />
                                    <strong>Passengers:</strong> {flight.passengers}
                                </div>
                                <button onClick={handleCancelFlight}>Cancel Booking</button>
                            </li>
                        ))
                    ) : (
                        <p>No booked flights found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ManageFlights;