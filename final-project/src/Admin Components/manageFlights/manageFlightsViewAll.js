import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Admin CSS Components/manageFlights CSS/manageFlightsViewAll.css'; // Ensure this path is correct
import SortFlights from './manageFlightsSort';

const AdminViewFlights = () => {
    const [flightList, setFlightList] = useState([]); // State to manage the list of flights
    const navigate = useNavigate();

    // Fetch flights from localStorage when the component mounts
    useEffect(() => {
        const storedFlights = fetchFlightsFromLocalStorage(); // Fetch and validate data from localStorage
        setFlightList(storedFlights);
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    // Function to handle deleting a flight
    const deleteFlight = (flightNumber) => {
        const updatedFlightList = flightList.filter(flight => flight.flightNumber !== flightNumber);
        setFlightList(updatedFlightList);
        saveFlightsToLocalStorage(updatedFlightList); // Save updated flight list to localStorage
    };

    // Function to handle editing a flight
    const editFlight = useCallback((flightNumber) => {
        if (flightNumber) {
            navigate(`/admin-manage-flights/edit/${flightNumber}`);
        } else {
            console.error("Invalid flight number provided for editing.");
        }
    }, [navigate]);

    // Function to handle sorting
    const sortFlights = (criteria, order) => {
        const sortedList = [...flightList].sort((a, b) => {
            if (order === 'asc') {
                return a[criteria] > b[criteria] ? 1 : -1;
            } else {
                return a[criteria] < b[criteria] ? 1 : -1;
            }
        });
        setFlightList(sortedList); // Update the flightList state with the sorted data
    };

    // Function to safely render an array or object as a string
    const renderValue = (value) => {
        if (Array.isArray(value)) {
            return value.length > 0 ? value.join(', ') : 'None'; // Show 'None' if array is empty
        }
        return value || ''; // Return the value itself if it's a primitive type or an empty string if undefined
    };

    return (
        <div className="admin-view-flights-container">
            <h2 className="admin-header-view-flights">Manage Flights</h2>

            {/* Sort Flights */}
            <SortFlights onSort={sortFlights} />

            {/* Flight List */}
            <div className="flight-list">
                {flightList.length > 0 ? (
                    <ul>
                        {flightList.map((flight) => (
                            <li key={flight.flightNumber}>
                                <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
                                <p><strong>From:</strong> {flight.from} <strong>To:</strong> {flight.to}</p>
                                <p><strong>Date:</strong> {flight.date}</p>
                                <p><strong>Departure Time:</strong> {flight.departureTime}</p>
                                <p><strong>Arrival Time:</strong> {flight.arrivalTime}</p>
                                <p><strong>Current Passenger Count:</strong> {flight.currentPassengerCount}</p>
                                
                                {/* Displaying prices for Economy and Premium classes */}
                                <p><strong>Economy Price:</strong> ${flight.economyPrice}</p>
                                <p><strong>Premium Price:</strong> ${flight.premiumPrice}</p>
                                
                                {/* Render classType safely */}
                                <p><strong>Class Types:</strong> {flight.classTypes ? flight.classTypes.join(', ') : 'N/A'}</p>
                
                                {/* Render occupied seats safely */}
                                <p><strong>Occupied Economy Seats:</strong> {renderValue(flight.occupiedEconomySeats)}</p>
                                <p><strong>Occupied Premium Seats:</strong> {renderValue(flight.occupiedPremiumSeats)}</p>
                
                                {/* Edit and Delete buttons */}
                                <button
                                    className="admin-view-flight-edit"
                                    onClick={() => editFlight(flight.flightNumber)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="admin-view-flight-delete"
                                    onClick={() => deleteFlight(flight.flightNumber)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No flights available to display.</p>
                )}
            </div>
        </div>
    );
};

// Utility function to save flights data to localStorage
const saveFlightsToLocalStorage = (flights) => {
    if (Array.isArray(flights) && flights.every(flight => flight && flight.flightNumber)) {
        localStorage.setItem('flights', JSON.stringify(flights));
    } else {
        console.error("Invalid flight data");
    }
};

// Utility function to fetch flights from localStorage
const fetchFlightsFromLocalStorage = () => {
    try {
        const storedFlights = JSON.parse(localStorage.getItem('flights')) || [];
        if (Array.isArray(storedFlights)) {
            return storedFlights;
        } else {
            console.error("Stored data is not an array. Resetting flights.");
            return [];
        }
    } catch (error) {
        console.error("Error parsing flight data from localStorage", error);
        return [];
    }
};

export default AdminViewFlights;