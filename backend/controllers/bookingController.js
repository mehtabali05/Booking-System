// backend/controllers/bookingController.js
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import Parent from "../models/Parent.js";
import Caretaker from "../models/Caretaker.js";
import sendEmail from "../utils/sendEmail.js";
import bookingRequestEmail from "../emails/bookingRequest.js";
import bookingAcceptedEmail from "../emails/bookingAccepted.js";
import bookingRejectedEmail from "../emails/bookingRejected.js";
import bookingCancelledEmail from "../emails/bookingCancelledEmail.js";
import Chat from "../models/Chat.js";
import { createChatForBooking } from "./chatController.js";


/**
 * =====================================
 * CREATE BOOKING (Parent → Caretaker)
 * =====================================
 */
export const createBooking = async (req, res) => {
  try {
    const {
      caretakerId,
      bookingDate,
      timeSlot,
      hours,
      message,
    } = req.body;
    // console.log("Req.body",req.body)

    const userId = req.user.id; // from auth middleware
    // console.log("User parent Id",req.user.id)
    // Validate required fields
    if (!caretakerId || !bookingDate || !timeSlot || !hours) {
      return res.status(400).json({
        success: false,
        message: "Missing required booking fields",
      });
    }


    // Find parent profile using logged-in user
    const parent = await Parent.findOne({ userId });
    if (!parent) {
      return res.status(403).json({
        success: false,
        message: "Parent profile not found",
      });
    }

    // Ensure caretaker exists
    const caretaker = await Caretaker.findById(caretakerId).populate("userId");
    if (!caretaker) {
      return res.status(404).json({
        success: false,
        message: "Caretaker not found",
      });
    }

    // 2. Calculate Total Price
    const totalAmount = (caretaker.hourlyRate || 0) * Number(hours);

    // Create booking in PENDING state
    const booking = await Booking.create({
      parentId: parent._id,
      caretakerId,
      bookingDate, 
      timeSlot,
      hours,
      message,
      totalAmount,
      status: "PENDING"
    });
 
    // Notify caretaker
    await Notification.create({
      userId: caretaker.userId._id,
      bookingId: booking._id,
      message: `New booking request from ${parent.fullName} for ${timeSlot}`,
    });

    sendEmail({
        to: caretaker.userId.email,
        subject: "New Booking Request - CareNest",
        html: bookingRequestEmail({
          parentName: parent.fullName,
          date: bookingDate,
          time: timeSlot,
        }),
      });

    return res.status(201).json({
      success: true,
      message: "Booking request sent successfully",
      booking,
    });
  } catch (error) {
    console.error("createBooking error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating booking",
    });
  }
};

/**
 * =====================================
 * GET BOOKINGS FOR PARENT DASHBOARD
 * =====================================
 */
export const getParentBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    // console.log("Parent UserId",req.user.id, req.user._id);
    const parent = await Parent.findOne({ userId });
    if (!parent) {
      return res.status(403).json({
        success: false,
        message: "Parent profile not found",
      });
    }

    const bookings = await Booking.find({ parentId: parent._id })
      .populate("caretakerId", "fullName city photo")
      .sort({ createdAt: -1 })
      .lean();
    
    // 2. Attach the chatId to each booking if it exists
    const bookingsWithChat = await Promise.all(
      bookings.map(async (booking) => {
        const chat = await Chat.findOne({ bookingId: booking._id });
        return {
          ...booking,
          chatId: chat ? chat._id : null, // Add the chatId here
        };
      })
    );

    return res.status(200).json({
      success: true,
      bookings: bookingsWithChat,
    });
  } catch (error) {
    console.error("getParentBookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching bookings",
    });
  }
};

/**
 * =====================================
 * GET BOOKINGS FOR CARETAKER DASHBOARD
 * =====================================
 */
export const getCaretakerBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const caretaker = await Caretaker.findOne({ userId });
    if (!caretaker) {
      return res.status(403).json({
        success: false,
        message: "Caretaker profile not found",
      });
    }

    const bookings = await Booking.find({ caretakerId: caretaker._id })
      .populate("parentId", "fullName city numberOfChildren photo")
      .sort({ createdAt: -1 })
      .lean();

    // 3. Attach the chatId to each booking by searching the Chat collection
    const bookingsWithChat = await Promise.all(
      bookings.map(async (booking) => {
        const chat = await Chat.findOne({ bookingId: booking._id });
        return {
          ...booking,
          chatId: chat ? chat._id : null, 
        };
      })
    );  

    return res.status(200).json({
      success: true,
      bookings: bookingsWithChat,
    });
  } catch (error) {
    console.error("getCaretakerBookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching bookings",
    });
  }
};

/**
 * =====================================
 * ACCEPT BOOKING (Caretaker Action)
 * =====================================
 */
export const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const caretaker = await Caretaker.findOne({ userId });
    if (!caretaker) {
      return res.status(403).json({
        success: false,
        message: "Caretaker profile not found",
      });
    }

    const booking = await Booking.findById(id);
    if (!booking || booking.caretakerId.toString() !== caretaker._id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Booking already responded",
      });
    }

    booking.status = "ACCEPTED";
    booking.respondedAt = new Date();
    await booking.save();

    // ✅ CREATE CHAT ROOM AFTER ACCEPTANCE
    // await Chat.create({
    //   bookingId: booking._id,
    //   parentId: booking.parentId,
    //   caretakerId: booking.caretakerId,
    //   messages: [],
    // }); 
    const chat = await createChatForBooking(booking._id);
    // Notify parent
    const parent = await Parent.findById(booking.parentId).populate("userId");

    await Notification.create({
      userId: parent.userId._id,
      bookingId: booking._id,
      message: "Your booking request has been accepted",
    });

    sendEmail({
        to: parent.userId.email,
        subject: "Booking Accepted - CareNest",
        html: bookingAcceptedEmail({
          caretakerName: caretaker.fullName,
          date: booking.bookingDate,
          time: booking.timeSlot,
        }),
      });
      

    return res.status(200).json({
      success: true,
      message: "Booking accepted",
      booking,
    });
  } catch (error) {
    console.error("acceptBooking error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error accepting booking",
    });
  }
}; 

/**
 * =====================================
 * REJECT BOOKING (Caretaker Action)
 * =====================================
 */ 
export const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const caretaker = await Caretaker.findOne({ userId });
    if (!caretaker) {
      return res.status(403).json({
        success: false,
        message: "Caretaker profile not found",
      });
    }

    const booking = await Booking.findById(id);
    if (!booking || booking.caretakerId.toString() !== caretaker._id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Booking already responded",
      });
    }

    booking.status = "REJECTED";
    booking.respondedAt = new Date();
    await booking.save();

    // Notify parent
    const parent = await Parent.findById(booking.parentId).populate("userId");

    await Notification.create({
      userId: parent.userId._id,
      bookingId: booking._id,
      message: "Your booking request has been rejected",
    });

    sendEmail({
        to: parent.userId.email,
        subject: "Booking Update - CareNest",
        html: bookingRejectedEmail({
          caretakerName: caretaker.fullName,
          date: booking.bookingDate,
        }),
      });
      

    return res.status(200).json({
      success: true,
      message: "Booking rejected",
      booking,
    });
  } catch (error) {
    console.error("rejectBooking error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error rejecting booking",
    });
  }
};



export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 1. Find booking and populate caretaker to get their User ID for notification
    const booking = await Booking.findById(id)
      .populate({ path: "parentId", populate: { path: "userId" } })
      .populate({ path: "caretakerId", populate: { path: "userId" } });

    if (!booking || booking.parentId.userId._id.toString() !== userId) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Only allow cancellation if the status is PENDING
    if (booking.status !== "PENDING") {
      return res.status(400).json({ success: false, message: "Can only cancel pending requests" });
    }

    // 2. Update Status
    booking.status = "CANCELLED";
    await booking.save();

    // 3. INTERNAL NOTIFICATION for Caretaker
    await Notification.create({
      userId: booking.caretakerId.userId._id,
      bookingId: booking._id,
      message: `The booking request from ${booking.parentId.fullName} has been cancelled.`,
    });

    // Format date for the email template
    const formattedDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // 4. EMAIL NOTIFICATION using your new template
    sendEmail({
      to: booking.caretakerId.userId.email,
      subject: "Booking Cancelled - CareNest",
      html: bookingCancelledEmail({
        parentName: booking.parentId.fullName,
        date: formattedDate,
      }),
    });

    return res.status(200).json({ 
      success: true, 
      message: "Booking cancelled and caretaker notified" 
    });
  } catch (error) {
    console.error("cancelBooking error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};