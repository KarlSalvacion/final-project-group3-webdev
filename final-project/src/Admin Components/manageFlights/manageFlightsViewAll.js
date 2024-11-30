import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Admin CSS Components/manageFlights CSS/manageFlightsViewAll.css'; // Ensure this path is correct

import SortFlights from './manageFlightsSort';

const AdminViewFlights = () => {
    const [flightList, setFlightList] = useState([]); // State to manage the list of flights
    const navigate = useNavigate();

    // Fetch flights from localStorage when the component mounts
    useEffect(() => {
        const storedFlights = JSON.parse(localStorage.getItem('flights')) || []; // Retrieve flights from localStorage
        setFlightList(storedFlights);
    }, []);

    // Function to handle deleting a flight
    const deleteFlight = (flightNumber) => {
        const updatedFlightList = flightList.filter(flight => flight.flightNumber !== flightNumber);
        setFlightList(updatedFlightList);
        localStorage.setItem('flights', JSON.stringify(updatedFlightList)); // Update localStorage
    };

    // Function to handle editing a flight
    const editFlight = (flightNumber) => {
        // Dynamically navigate to the edit page with the flightNumber in the route
        navigate(`/admin-manage-flights/edit/${flightNumber}`);
    };

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
                                <p><strong>Passengers:</strong> {flight.currentPassengers}</p>
                                <p><strong>Class Types:</strong> {flight.classType.join(', ')}</p>

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

export default AdminViewFlights;
