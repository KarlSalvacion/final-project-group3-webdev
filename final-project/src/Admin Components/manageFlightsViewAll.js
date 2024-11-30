import React, { useState } from 'react';
import flights from '../Data/flightsList'; // Importing the flights data
import '../Admin CSS Components/manageFlightsViewAll.css'; // Import your custom CSS for styling

import SortFlights from './manageFlightsSort'; // Import the SortFlights component

const AdminViewFlights = () => {
    const [flightList, setFlightList] = useState(flights); // State to manage the list of flights

    // Function to handle deleting a flight
    const deleteFlight = (flightNumber) => {
        const updatedFlightList = flightList.filter(flight => flight.flightNumber !== flightNumber);
        setFlightList(updatedFlightList);
    };

    // Function to handle editing a flight (example alert, implement as needed)
    const editFlight = (flightNumber) => {
        alert(`Edit flight ${flightNumber}`);
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
        setFlightList(sortedList);
    };

    return (
        <div className="admin-view-flights-container">
            <h2 className="admin-header-view-flights">Manage Flights</h2>

            {/* Sort Flights */}
            <SortFlights onSort={sortFlights} />

            {/* Flight List */}
            <div className="flight-list">
                <ul>
                    {flightList.map((flight) => (
                        <li key={flight.flightNumber}>
                            <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
                            <p><strong>From:</strong> {flight.from} <strong>To:</strong> {flight.to}</p>
                            <p><strong>Date:</strong> {flight.date}</p>
                            <p><strong>Departure Time:</strong> {flight.departureTime}</p>
                            <p><strong>Arrival Time:</strong> {flight.arrivalTime}</p>
                            <p><strong>Passengers:</strong> {flight.passengers}</p>
                            <p><strong>Class Types:</strong> {flight.classType.join(', ')}</p>

                            {/* Edit and Delete buttons */}
                            <button className="admin-view-flight-edit" onClick={() => editFlight(flight.flightNumber)}>Edit</button>
                            <button className="admin-view-flight-delete" onClick={() => deleteFlight(flight.flightNumber)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminViewFlights;
