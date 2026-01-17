const bookingCancelledEmail = ({ parentName, date }) => {
    return `
      <h2>Booking Cancelled</h2>
      <p>A previously requested booking has been cancelled by the parent.</p>
      <p><strong>Parent:</strong> ${parentName}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p>This time slot is now available for other bookings.</p>
    `;
  };
  
  export default bookingCancelledEmail;