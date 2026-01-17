const bookingRequestEmail = ({ parentName, date, time }) => {
    return `
      <h2>New Booking Request</h2>
      <p>You have received a new booking request.</p>
      <p><strong>Parent:</strong> ${parentName}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p>Please log in to your dashboard to accept or reject.</p>
    `;
  };
  
  export default bookingRequestEmail;
  