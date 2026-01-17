import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "nestcare8@gmail.com",
    pass: process.env.EMAIL_PASS || "lciu qwnk kmnq rncc",
  },
});

/** 
 * Generic email sender
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"CareNest" <noreply@carenest.com>',
      to,
      subject,
      html,
    });
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};

export default sendEmail;
