import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons'; // Import the plane icon
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
        // Navigate to the booking-details page, passing flight details
        navigate("/booking-details", { state: { departureFlight: flight } });
    };

    return (
        <div className="flight-container">
            <h1 className="title">Available Flights</h1>

            {/* If no flights are available */}
            {flightList.length === 0 ? (
                <div className="no-flights-message">
                    <p className="message">Sorry! No flights available at the moment.</p>
                </div>
            ) : (
                // If flights are available, display them in a horizontal layout
                <div className="flight-list">
                    {flightList.map((flight) => {
                        const currentPassenger = flight.currentPassengerCount || 0; // Access currentPassengerCount from each flight object
                        const economyPrice = flight.economyPrice || 'Price unavailable'; // Access economyPrice from each flight object
                        const premiumPrice = flight.premiumPrice || 'Price unavailable';
                        const classType = flight.classTypes || []; // Access classTypes from each flight object
                        return (
                            <div className="flight-card" key={flight.flightNumber}>
                                <div className="flight-details">
                                    <span className="view-flights-bold-text">{flight.flightNumber}</span>
                                    <span className="view-flights-bold-text">{flight.from}</span>
                                    <span>
                                        <FontAwesomeIcon icon={faPlane} className="view-flight-plane-icon" /> {/* Plane icon */}
                                    </span>
                                    <span className="view-flights-bold-text">{flight.to}</span>
                                    <span>{flight.date ? new Date(flight.date).toLocaleDateString() : 'Date unavailable'}</span>
                                    <span>{flight.departureTime}</span>
                                    <span>{flight.arrivalTime}</span>
                                    <span>Passenger Count: {currentPassenger}</span>
                                    <span>{classType.length > 0 ? classType.join(" ") : 'Class type unavailable'}</span>
                                    <span>Economy: ${economyPrice}</span>
                                    <span>Premium: ${premiumPrice}</span>
                                    <button
                                        className="book-button"
                                        onClick={() => handleBookFlight(flight)} // Call handleBookFlight with the selected flight
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