import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../Admin CSS Components/manageFlights CSS/manageFlightsEdit.css"; // Import custom CSS for styling

const EditFlights = ({ onUpdate }) => {
  const { flightNumber } = useParams(); // Get the flight number from the route params
  const navigate = useNavigate();

  const [flightDetails, setFlightDetails] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch flight details from localStorage by flight number
  useEffect(() => {
    const storedFlights = JSON.parse(localStorage.getItem("flights")) || [];
    const selectedFlight = storedFlights.find(
      (flight) => flight.flightNumber === flightNumber
    );
    if (selectedFlight) {
      setFlightDetails(selectedFlight);
    } else {
      alert("Flight not found");
      navigate("/admin-manage-flights"); // Redirect back to manage flights if not found
    }
  }, [flightNumber, navigate]);

  // Validate input fields
  const validate = () => {
    const { from, to, date, classType } = flightDetails || {};
    const textOnlyRegex = /^[A-Za-z\s]+$/; // Letters and spaces only
    const classTypeRegex = /^[A-Za-z\s,]+$/; // Letters, spaces, and commas only
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    const validationErrors = {};

    // From Validation
    if (!from) {
      validationErrors.from = "From location is required.";
    } else if (!textOnlyRegex.test(from)) {
      validationErrors.from = "From location must contain only letters and spaces.";
    }

    // To Validation
    if (!to) {
      validationErrors.to = "To location is required.";
    } else if (!textOnlyRegex.test(to)) {
      validationErrors.to = "To location must contain only letters and spaces.";
    }

    // Date Validation
    if (!date) {
      validationErrors.date = "Date is required.";
    } else if (date < today) {
      validationErrors.date = "Date cannot be in the past.";
    }

    // Class Type Validation
    if (!classType) {
      validationErrors.classType = "Class types are required.";
    } else if (!classTypeRegex.test(classType.join(", "))) {
      validationErrors.classType =
        "Class types must contain only letters, spaces, and commas.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFlightDetails({
      ...flightDetails,
      [name]: name === "passengers" ? Math.max(0, parseInt(value)) || 0 : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
        const storedFlights = JSON.parse(localStorage.getItem("flights")) || [];
        
        // Update only the flight with the matching flightNumber
        const updatedFlights = storedFlights.map((flight) =>
            flight.flightNumber === flightDetails.flightNumber
                ? { ...flight, ...flightDetails } // Only update the flight with matching flight number
                : flight
        );

        // Save the updated flight list back to localStorage
        localStorage.setItem("flights", JSON.stringify(updatedFlights));

        if (onUpdate) {
            onUpdate(flightDetails);
        }

        alert("Flight details updated successfully");
        navigate("/admin-manage-flights/view-all"); // Redirect to the view all flights page
    }
};

  if (!flightDetails) {
    return <p>Loading flight details...</p>;
  }

  return (
    <div className="admin-edit-flight-container">
      <h2>Edit Flight</h2>
      <form onSubmit={handleSubmit} className="admin-edit-flight-form">
        <div className="form-group">
          <label>Flight Number</label>
          <input
            type="text"
            name="flightNumber"
            value={flightDetails.flightNumber}
            disabled // Disable the input field for flight number
            required
          />
        </div>
        <div className="form-group">
          <label>From</label>
          <input
            type="text"
            name="from"
            value={flightDetails.from}
            onChange={handleInputChange}
            required
          />
          {errors.from && <p className="error-text">{errors.from}</p>}
        </div>
        <div className="form-group">
          <label>To</label>
          <input
            type="text"
            name="to"
            value={flightDetails.to}
            onChange={handleInputChange}
            required
          />
          {errors.to && <p className="error-text">{errors.to}</p>}
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={flightDetails.date}
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]}
            required
          />
          {errors.date && <p className="error-text">{errors.date}</p>}
        </div>
        <div className="form-group">
          <label>Passengers</label>
          <input
            type="number"
            name="passengers"
            value={flightDetails.passengers}
            disabled // Disable the input field for passengers
            required
          />
          {errors.passengers && <p className="error-text">{errors.passengers}</p>}
        </div>
        <div className="form-group">
          <label>Class Types (Comma Separated)</label>
          <input
            type="text"
            name="classType"
            value={flightDetails.classType.join(", ")}
            onChange={(e) =>
              setFlightDetails({
                ...flightDetails,
                classType: e.target.value.split(",").map((type) => type.trim()),
              })
            }
            required
          />
          {errors.classType && <p className="error-text">{errors.classType}</p>}
        </div>
        <button type="submit" className="admin-save-flight-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditFlights;
