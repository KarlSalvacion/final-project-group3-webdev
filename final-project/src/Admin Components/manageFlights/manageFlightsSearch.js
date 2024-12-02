import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate
import '../../Admin CSS Components/manageFlights CSS/manageFlightsSearch.css'; // Import your CSS

const AdminSearchFlights = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState('from'); // Default category
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(''); // Error state for validation
    const [flights, setFlights] = useState([]); // State to store flights from localStorage

    const navigate = useNavigate(); // Initialize navigate function

    // Fetch flights from localStorage when the component mounts
    useEffect(() => {
        const storedFlights = JSON.parse(localStorage.getItem('flights')) || []; // Retrieve flights from localStorage
        setFlights(storedFlights);
    }, []);

    // Function to handle search
    const handleSearch = () => {
        // Reset error message
        setError('');
        setSearchResults([]); // Clear previous search results

        if (!searchQuery.trim()) {
            setError('Please enter a search query.');
            return;
        }

        const results = flights.filter((flight) => {
            const lowerQuery = searchQuery.toLowerCase();
            switch (searchCategory) {
                case 'from':
                    return flight.from && flight.from.toLowerCase().includes(lowerQuery);
                case 'to':
                    return flight.to && flight.to.toLowerCase().includes(lowerQuery);
                case 'date':
                    return flight.date && flight.date.includes(lowerQuery); // Assuming date is in string format
                default:
                    return false;
            }
        });

        if (results.length === 0) {
            setError('No flights found matching your criteria.');
        }

        setSearchResults(results);
    };

    // Function to handle editing flight
    const handleEditFlight = (flightNumber) => {
        navigate(`/admin-manage-flights/edit/${flightNumber}`); // Navigate to edit page with flight number
    };

    // Function to handle deleting flight
    const handleDeleteFlight = (flightNumber) => {
        // Remove the flight from localStorage
        const updatedFlights = flights.filter(flight => flight.flightNumber !== flightNumber);
        localStorage.setItem('flights', JSON.stringify(updatedFlights));

        // Update state to reflect the deletion
        setFlights(updatedFlights);
        setSearchResults(updatedFlights.filter(flight => flight.flightNumber !== flightNumber)); // Update search results as well
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
                {searchResults.length > 0 ? (
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
                                    <p><strong>Class Types:</strong> {flight.classType ? flight.classType.join(', ') : 'N/A'}</p>
                                </div>
                                <div className="flight-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEditFlight(flight.flightNumber)} // Edit button now navigates to the edit page
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteFlight(flight.flightNumber)} // Delete button calls handleDeleteFlight
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No search results to display.</p>
                )}
            </div>
        </div>
    );
};

export default AdminSearchFlights;