import express from "express";
import {
  createBooking,
  getParentBookings,
  getCaretakerBookings,
  acceptBooking,
  rejectBooking,
  cancelBooking,
} from "../controllers/bookingController.js";

import authenticate from "../middlewares/authenticateUser.js";
import authorizeRole from "../middlewares/authorizeRole.js";

const router = express.Router();

/**
 * =====================================
 * PARENT ROUTES
 * =====================================
 */

// Parent creates a booking request
router.post( 
  "/",
  authenticate,
  authorizeRole("parent"),
  createBooking
);

// Parent views their bookings
router.get(
  "/parent",
  authenticate,
  authorizeRole("parent"),
  getParentBookings
);

/**
 * =====================================
 * CARETAKER ROUTES
 * =====================================
 */

// Caretaker views incoming booking requests
router.get(
  "/caretaker",
  authenticate,
  authorizeRole("caretaker"),
  getCaretakerBookings
);

// Caretaker accepts booking
router.patch(
  "/:id/accept",
  authenticate,
  authorizeRole("caretaker"),
  acceptBooking
);

// Caretaker rejects booking
router.patch(
  "/:id/reject",
  authenticate,
  authorizeRole("caretaker"),
  rejectBooking
);

// Add this under PARENT ROUTES
router.patch(
  "/:id/cancel", 
  authenticate, 
  authorizeRole("parent"), 
  cancelBooking
);

export default router; 

