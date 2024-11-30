import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import '../../Admin CSS Components/manageFlights CSS/manageFlightsSort.css'; // Import CSS file for styling

const SortFlights = ({ onSort }) => {
    // State to track sorting order for each criterion
    const [sortOrders, setSortOrders] = useState({
        flightNumber: 'asc',
        from: 'asc',
        to: 'asc',
        date: 'asc',
        departureTime: 'asc',
        arrivalTime: 'asc',
        passengers: 'asc', // Added state for passenger count
    });

    const handleSort = (criteria) => {
        // Toggle sorting order
        const newOrder = sortOrders[criteria] === 'asc' ? 'desc' : 'asc';
        setSortOrders((prevOrders) => ({
            ...prevOrders,
            [criteria]: newOrder,
        }));

        // Call the sorting function with the selected criteria and new order
        onSort(criteria, newOrder);
    };

    return (
        <div className="sort-flights-container">
            <h3 className="sort-flights-header">Sort Flights</h3>
            <div className="sort-buttons">
                <button onClick={() => handleSort('flightNumber')}>
                    Flight Number {sortOrders.flightNumber === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />}
                </button>
                <button onClick={() => handleSort('from')}>
                    From {sortOrders.from === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />}
                </button>
                <button onClick={() => handleSort('to')}>
                    To {sortOrders.to === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />}
                </button>
                <button onClick={() => handleSort('date')}>
                    Date {sortOrders.date === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />}
                </button>
                <button onClick={() => handleSort('departureTime')}>
                    Departure Time {sortOrders.departureTime === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />}
                </button>
                <button onClick={() => handleSort('arrivalTime')}>
                    Arrival Time {sortOrders.arrivalTime === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />}
                </button>
                <button onClick={() => handleSort('passengers')}>
                    Passengers {sortOrders.passengers === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />}
                </button>
            </div>
        </div>
    );
};

export default SortFlights;
