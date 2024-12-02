// src/services/flightService.js

export const updateFlightData = (flightNumber, selectedSeats, occupiedPremiumSeats, occupiedEconomySeats) => {
    const storedFlights = JSON.parse(localStorage.getItem('flights')) || [];
    
    const updatedFlights = storedFlights.map(flight => {
      if (flight.flightNumber === flightNumber) {
        // Update current passenger count
        flight.currentPassengerCount = (flight.currentPassengerCount || 0) + selectedSeats.length;
  
        // Update occupied seats based on class
        flight.occupiedPremiumSeats = (flight.occupiedPremiumSeats || []).concat(occupiedPremiumSeats);
        flight.occupiedEconomySeats = (flight.occupiedEconomySeats || []).concat(occupiedEconomySeats);
      }
      return flight;
    });
  
    localStorage.setItem('flights', JSON.stringify(updatedFlights)); // Save updated flights in localStorage
  };
  
  export const removeBookingFromFlightData = (flightNumber, occupiedPremiumSeats, occupiedEconomySeats) => {
    const storedFlights = JSON.parse(localStorage.getItem('flights')) || [];
    
    const updatedFlights = storedFlights.map(flight => {
      if (flight.flightNumber === flightNumber) {
        // Decrease current passenger count
        flight.currentPassengerCount = (flight.currentPassengerCount || 0) - (occupiedPremiumSeats.length + occupiedEconomySeats.length);
  
        // Remove occupied seats based on class
        flight.occupiedPremiumSeats = (flight.occupiedPremiumSeats || []).filter(seat => !occupiedPremiumSeats.includes(seat));
        flight.occupiedEconomySeats = (flight.occupiedEconomySeats || []).filter(seat => !occupiedEconomySeats.includes(seat));
      }
      return flight;
    });
  
    localStorage.setItem('flights', JSON.stringify(updatedFlights)); // Save updated flights in localStorage
  };