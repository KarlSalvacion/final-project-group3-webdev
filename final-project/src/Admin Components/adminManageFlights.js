import React, { useState } from 'react';
import flights from '../Data/flightsList'; // Importing the flights data

const ManageFlights = () => {
    const [flightList, setFlightList] = useState(flights); // State to manage the list of flights
    const [formData, setFormData] = useState({
        flightNumber: '',
        from: '',
        to: '',
        date: '',
        departureTime: '',
        arrivalTime: '',
        passengers: 0,
        classType: ['Economy', 'Premium'],
    });

    // Function to handle adding a new flight
    const handleAddFlight = (e) => {
        e.preventDefault();
        setFlightList([...flightList, formData]);
        // Clear form after adding
        setFormData({
            flightNumber: '',
            from: '',
            to: '',
            date: '',
            departureTime: '',
            arrivalTime: '',
            passengers: 0,
            classType: ['Economy', 'Premium'],
        });
    };

    // Function to handle updating an existing flight
    const handleUpdateFlight = (index) => {
        const updatedFlight = flightList[index];
        setFormData(updatedFlight);
    };

    // Function to handle deleting a flight
    const handleDeleteFlight = (flightNumber) => {
        const updatedList = flightList.filter(flight => flight.flightNumber !== flightNumber);
        setFlightList(updatedList);
    };

    // Handle input change for the form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className="manage-flights-container">
            <h2 className="header-manage">Manage Flights</h2>
            
            {/* Flight list */}
            <div className="flight-list">
                
                <ul>
                    {flightList.map((flight, index) => (
                        <li key={flight.flightNumber}>
                            <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
                            <p><strong>From:</strong> {flight.from} <strong>To:</strong> {flight.to}</p>
                            <p><strong>Date:</strong> {flight.date}</p>
                            <p><strong>Departure Time:</strong> {flight.departureTime}</p>
                            <p><strong>Arrival Time:</strong> {flight.arrivalTime}</p>
                            <p><strong>Passengers:</strong> {flight.passengers}</p>
                            <p><strong>Class Types:</strong> {flight.classType.join(', ')}</p>
                            <button onClick={() => handleUpdateFlight(index)}>Edit</button>
                            <button onClick={() => handleDeleteFlight(flight.flightNumber)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Add/Edit Flight Form */}
            <div className="flight-form">
                <h3>{formData.flightNumber ? 'Edit Flight' : 'Add New Flight'}</h3>
                <form onSubmit={handleAddFlight}>
                    <div className="form-group">
                        <label>Flight Number</label>
                        <input
                            type="text"
                            name="flightNumber"
                            value={formData.flightNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>From</label>
                        <input
                            type="text"
                            name="from"
                            value={formData.from}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>To</label>
                        <input
                            type="text"
                            name="to"
                            value={formData.to}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Departure Time</label>
                        <input
                            type="time"
                            name="departureTime"
                            value={formData.departureTime}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Arrival Time</label>
                        <input
                            type="time"
                            name="arrivalTime"
                            value={formData.arrivalTime}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Passengers</label>
                        <input
                            type="number"
                            name="passengers"
                            value={formData.passengers}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Class Types</label>
                        <select
                            multiple
                            name="classType"
                            value={formData.classType}
                            onChange={handleInputChange}
                        >
                            <option value="Economy">Economy</option>
                            <option value="Premium">Premium</option>
                        </select>
                    </div>
                    <button type="submit">{formData.flightNumber ? 'Update Flight' : 'Add Flight'}</button>
                </form>
            </div>
        </div>
    );
};

export default ManageFlights;
