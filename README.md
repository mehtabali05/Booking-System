Booking System Backend
📌 Overview

This project is a fullstack system for a caretaker booking platform, implementing booking lifecycle management and private dashboard-based chat between parents and caretakers.

🧠 Core Features

Booking Lifecycle Management

Pending → Accepted → Rejected / Completed

Automatic Chat Room Creation

Chat is created only after booking acceptance

Linked with Booking ID, Parent ID, and Caretaker ID

Private Dashboard-Based Chat

Text-only messages stored in database

Chat becomes read-only after booking completion or cancellation

Secure Access Control

Chat available only inside authenticated dashboards

No chat access via public profile pages

Notification Logic

Message badge/count for new messages

🛠 Tech Stack

Node.js

Express.js

MongoDB

REST APIs

MVC Architecture

🗂 Database Design (Simplified)

Chat Collection

{
  bookingId,
  parentId,
  caretakerId,
  messages: [
    {
      sender,
      text,
      timestamp
    }
  ]
}

🔐 Security & Best Practices

RESTful API design

Input validation

Role-based access control

Scalable schema without real-time dependency (MVP-ready)

🚀 Status

Backend completed and delivered to client.
