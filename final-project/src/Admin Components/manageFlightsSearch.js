import React, { useState } from 'react';
import flights from '../Data/flightsList'; // Importing flights data
import '../Admin CSS Components/manageFlightsSearch.css'; // Import your CSS

const SearchFlights = ({ onEditFlight, onDeleteFlight }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState('from'); // Default category
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(''); // Error state for validation

    // Function to handle search
    const handleSearch = () => {
        // Reset error message
        setError('');

        if (!searchQuery.trim()) {
            setError('Please enter a search query.');
            return;
        }

        const results = flights.filter((flight) => {
            const lowerQuery = searchQuery.toLowerCase();
            switch (searchCategory) {
                case 'from':
                    return flight.from.toLowerCase().includes(lowerQuery);
                case 'to':
                    return flight.to.toLowerCase().includes(lowerQuery);
                case 'date':
                    return flight.date.includes(searchQuery); // Assuming date is in string format
                default:
                    return false;
            }
        });

        if (results.length === 0) {
            setError('No flights found matching your criteria.');
        }

        setSearchResults(results);
    };

    return (
        <div className="search-flight-container">
            <h2 className="search-flight-header">Search Flights</h2>

            {/* Error Message */}
            {error && <p className="error-message">{error}</p>}

            {/* Category Selection and Search Bar */}
            <div className="search-menu-bar">
                <select
                    className="search-category"
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                >
                    <option value="from">From</option>
                    <option value="to">To</option>
                    <option value="date">Date</option>
                </select>

                <input
                    type="text"
                    placeholder={`Search by ${searchCategory.charAt(0).toUpperCase() + searchCategory.slice(1)}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />

                <button onClick={handleSearch} className="search-button">
                    Search
                </button>
            </div>

            {/* Search Results */}
            <div className="search-results">
                {searchResults.length > 0 && (
                    <ul>
                        {searchResults.map((flight) => (
                            <li key={flight.flightNumber} className="flight-item">
                                <div className="flight-details">
                                    <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
                                    <p><strong>From:</strong> {flight.from} <strong>To:</strong> {flight.to}</p>
                                    <p><strong>Date:</strong> {flight.date}</p>
                                    <p><strong>Departure Time:</strong> {flight.departureTime}</p>
                                    <p><strong>Arrival Time:</strong> {flight.arrivalTime}</p>
                                    <p><strong>Passengers:</strong> {flight.passengers}</p>
                                    <p><strong>Class Types:</strong> {flight.classType.join(', ')}</p>
                                </div>
                                <div className="flight-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => onEditFlight(flight.flightNumber)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => onDeleteFlight(flight.flightNumber)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SearchFlights;
