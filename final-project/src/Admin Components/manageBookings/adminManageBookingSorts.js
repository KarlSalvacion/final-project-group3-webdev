export const sortBookings = (bookings, sortCriteria, sortOrder) => {
  return bookings.sort((a, b) => {
    let comparison = 0;

    const getSortValue = (booking, criteria) => {
      if (criteria === 'username') {
        return booking.username.toLowerCase(); // Ensures case-insensitive sorting
      }
      if (criteria === 'occupiedSeats') {
        return booking.bookings[0]?.selectedSeats.length; // Example sorting by number of occupied seats
      }
      return booking.bookings[0]?.flightDetails[criteria]?.toString().toLowerCase() || ''; // Handles other criteria dynamically
    };

    const aValue = getSortValue(a, sortCriteria);
    const bValue = getSortValue(b, sortCriteria);

    if (aValue > bValue) {
      comparison = 1;
    } else if (aValue < bValue) {
      comparison = -1;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
};
