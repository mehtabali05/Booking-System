const bookingRejectedEmail = ({ caretakerName, date }) => {
    return `
      <h2>Booking Rejected</h2>
      <p>Unfortunately, your booking was declined.</p>
      <p><strong>Caretaker:</strong> ${caretakerName}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p>You may try booking another caretaker.</p>
    `;
  };
  
  export default bookingRejectedEmail;
  