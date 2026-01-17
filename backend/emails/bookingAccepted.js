const bookingAcceptedEmail = ({ caretakerName, date, time }) => {
    return `
      <h2>Booking Accepted</h2>
      <p>Your booking request has been accepted.</p>
      <p><strong>Caretaker:</strong> ${caretakerName}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p>Thank you for using CareNest.</p>
    `;
  };
  
  export default bookingAcceptedEmail;
  