import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS Components/userViewFlights CSS/viewFlights.css'; // Import your custom CSS for styling

const ViewFlights = () => {
    const [flightList, setFlightList] = useState([]); // State to manage the list of flights
    const navigate = useNavigate();

    // Fetch flights from localStorage when the component mounts
    useEffect(() => {
        const storedFlights = JSON.parse(localStorage.getItem('flights')) || []; // Retrieve flights from localStorage
        console.log(storedFlights); // Log to check the structure
        setFlightList(storedFlights);
    }, []);

    // Function to handle booking a flight
    const handleBookFlight = (flight) => {
        // Navigate to the seat selection page, passing flight details
        navigate("/seat-selection", { state: { flight } });
    };

    return (
        <div className="flight-container">
            <h1 className="title">Available Flights</h1>
            <h1>PALITAN ANG LAYOUT NG PABABA YUG MGA FLIGHT CARDS MAMAYA</h1>

            {/* If no flights are available */}
            {flightList.length === 0 ? (
                <div className="no-flights-message">
                    <p className="message">Sorry! No flights available at the moment.</p>
                </div>
            ) : (
                // If flights are available, display them in a horizontal layout
                <div className="flight-list">
                    {flightList.map((flight) => {
                        const currentPassenger = flight.currentPassenger || 0; // Access currentPassenger from each flight object
                        return (
                            <div className="flight-card" key={flight.flightNumber}>
                                <div className="flight-details">
                                    <p><strong>{flight.from}</strong> <span>➡️</span> <strong>{flight.to}</strong></p>
                                    <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
                                    <p><strong>Departure:</strong> {flight.date ? new Date(flight.date).toLocaleDateString() : 'Date unavailable'} at {flight.departureTime}</p>
                                    <p><strong>Passengers:</strong> {currentPassenger}</p> {/* Display currentPassenger */}
                                    <p><strong>Class Type:</strong> {flight.classType.join(" | ")}</p>
                                    <button
                                        className="book-button"
                                        onClick={() => handleBookFlight(flight)}
                                    >
                                        Book
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ViewFlights;
