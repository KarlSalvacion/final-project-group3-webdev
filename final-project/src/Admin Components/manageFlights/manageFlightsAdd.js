import React, { useState, useEffect } from "react";
import '../../Admin CSS Components/manageFlights CSS/manageFlightsAdd.css'; // Import your CSS for styling

const AddFlights = () => {
  const [flightData, setFlightData] = useState({
    flightNumber: "",
    from: "",
    to: "",
    date: "",
    departureTime: "",
    arrivalTime: "",
    classType: "",
  });

  const [errors, setErrors] = useState({}); // Track individual errors
  const [minDate, setMinDate] = useState(""); // State to hold minimum date

  // Set the minimum date on component mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);
  }, []);

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlightData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error for the specific field on input change
    }));
  };

  // Function to handle validations
  const validateInputs = () => {
    const { flightNumber, from, to, date, classType } = flightData;
    const flightNumberRegex = /^[A-Z]{3}[0-9]{3}$/; // 3 capital letters + 3 numbers
    const textOnlyRegex = /^[A-Za-z\s]+$/; // Letters and spaces only
    const classTypeRegex = /^[A-Za-z\s,]+$/; // Letters, spaces, and commas only
    
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    
    const validationErrors = {};

    // Get existing flights from localStorage
    const existingFlights = JSON.parse(localStorage.getItem("flights")) || [];

    // Check for empty fields
    if (!flightNumber) {
      validationErrors.flightNumber = "Flight number is required.";
    } else if (!flightNumberRegex.test(flightNumber)) {
      validationErrors.flightNumber = "Flight number must be 3 capital letters followed by 3 numbers.";
    } else if (existingFlights.some((flight) => flight.flightNumber === flightNumber)) {
      validationErrors.flightNumber = "Flight number must be unique.";
    }

    if (!from) {
      validationErrors.from = "From location is required.";
    } else if (!textOnlyRegex.test(from)) {
      validationErrors.from = "From location must contain only letters and spaces.";
    }

    if (!to) {
      validationErrors.to = "To location is required.";
    } else if (!textOnlyRegex.test(to)) {
      validationErrors.to = "To location must contain only letters and spaces.";
    }

    if (!date) {
      validationErrors.date = "Date is required.";
    } else if (date < today) {
      validationErrors.date = "Date cannot be in the past. Please choose a future date.";
    }

    if (!classType) {
      validationErrors.classType = "Class types are required.";
    } else if (!classTypeRegex.test(classType)) {
      validationErrors.classType = "Class types must contain only letters, spaces, and commas.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0; // Valid if no errors
  };

  // Function to handle adding the flight
  const handleAddFlight = () => {
    if (!validateInputs()) {
      return; // Stop execution if validation fails
    }

    // Capitalize first letters for 'from', 'to', and classType
    const formatText = (text) =>
      text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

    const formattedFrom = formatText(flightData.from);
    const formattedTo = formatText(flightData.to);

    const formattedClassTypes = flightData.classType
      .split(",")
      .map((type) => formatText(type.trim()));

    const newFlight = {
      ...flightData,
      from: formattedFrom,
      to: formattedTo,
      classType: formattedClassTypes,
      currentPassengers: 0, // Set current passengers to 0 initially
      maximumPassengers: 198, // Maximum passengers is always 198
    };

    // Get existing flights from localStorage or initialize an empty array
    const existingFlights = JSON.parse(localStorage.getItem("flights")) || [];

    // Add new flight to the existing list
    existingFlights.push(newFlight);

    // Update localStorage with the new list
    localStorage.setItem("flights", JSON.stringify(existingFlights));

    // Clear form and show success message
    setFlightData({
      flightNumber: "",
      from: "",
      to: "",
      date: "",
      departureTime: "",
      arrivalTime: "",
      classType: "",
    });
    setErrors({});
    alert("Flight added successfully!");
  };

  return (
    <div className="manage-flights-add-container">
      <h2 className="add-flights-header">Add Flight</h2>

      <div className="add-flights-form">
        {["flightNumber", "from", "to", "date", "departureTime", "arrivalTime", "classType"].map((field) => (
          <div key={field} className="form-group">
            <input
              type={
                field === "date"
                  ? "date"
                  : field === "departureTime" || field === "arrivalTime"
                  ? "time"
                  : "text"
              }
              name={field}
              placeholder={
                {
                  flightNumber: "Flight Number (e.g., ABC123)",
                  from: "From",
                  to: "To",
                  date: "Date",
                  departureTime: "Departure Time",
                  arrivalTime: "Arrival Time",
                  classType: "Class Type (e.g., Economy, Premium)",
                }[field]
              }
              value={flightData[field]}
              onChange={handleChange}
              className="add-flights-input"
              min={field === "date" ? minDate : undefined}
            />
            {errors[field] && <p className="error-text">{errors[field]}</p>}
          </div>
        ))}

        <button onClick={handleAddFlight} className="add-flights-button">
          Add Flight
        </button>
      </div>
    </div>
  );
};

export default AddFlights;
