import Booking from "../models/Booking.js";
import Caretaker from "../models/Caretaker.js";
import Parent from "../models/Parent.js";

/**
 * ================================
 * CREATE OR UPDATE CARETAKER PROFILE
 * ================================
 * - Used when caretaker completes or edits profile
 * - Profile is uniquely identified by userId
 */
export const upsertCaretakerProfile = async (req, res) => {
  try {
    // console.log("Incoming caretaker payload:", req.body);
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // Extract profile fields from request body
    const {
      fullName,
      city,
      dateOfBirth,
      gender,
      education,
      skills,
      languages,
      preference,
      description,
      availability,
      visibility,
      hourlyRate,
      notificationsEnabled,
      photo
    } = req.body;

    let parsedAvailability;
    if (availability !== undefined && availability !== "") {
      if (typeof availability === "string") {
        try {
          parsedAvailability = JSON.parse(availability);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: "Invalid availability format",
          });
        }
      } else {
        parsedAvailability = availability;
      }
    }

    const updateData = {
      userId,
      fullName,
      city,
      dateOfBirth,
      gender,
      education,
      preference,
      skills: Array.isArray(skills) ? skills : skills?.split(',').map(s => s.trim()),
      profileCompleted: true,
      description,
      notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : true,
      // availability: parsedAvailability,
      visibility: visibility || "public",
      notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : true,
      hourlyRate,
      languages: Array.isArray(languages) ? languages : languages?.split(',').map(l => l.trim()),
    };


    
    if (parsedAvailability !== undefined) {
      updateData.availability = parsedAvailability;
    }

    if (photo) updateData.photo = photo;

    const caretaker = await Caretaker.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true,runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Caretaker profile saved successfully",
      caretaker,
    });
  } catch (error) {
    console.error("upsertCaretakerProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error saving caretaker profile",
    });
  }
};

/**
 * ================================
 * GET ALL CARETAKER CARDS (PUBLIC)
 * ================================
 * - Used on Parent side to browse caretakers
 * - Only exposes safe, card-level data
 */
export const getAllCaretakerCards = async (req, res) => {
  try {
    const caretakers = await Caretaker.find({ 
      visibility: "public",
      profileCompleted: true })
      .select("fullName city rating photo description preference hourlyRate skills languages education")
      .lean(); 

    // 2. Logic to trim description for the card view (optional but recommended)
    const formattedCaretakers = caretakers.map(ct => ({
      ...ct,
      // Provide a short snippet for the card if the description is too long
      shortDescription: ct.description?.length > 100 
        ? ct.description.substring(0, 100) + "..." 
        : ct.description
    }));  

    return res.status(200).json({
      success: true,
      caretakers: formattedCaretakers,
    });
  } catch (error) {
    console.error("getAllCaretakerCards error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching caretakers",
    });
  }
};

/**
 * ================================
 * GET SINGLE CARETAKER PROFILE
 * ================================ 
 * - Used when parent opens caretaker profile page
 */
export const getCaretakerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const requestorId = req.user.id;
    // console.log("requestorId",requestorId);
    // console.log("param ID",id);
    const caretaker = await Caretaker.findOne({
      $or: [{ _id: id }, { userId: id }],
    });

    if (!caretaker) {
      return res.status(404).json({
        success: false,
        message: "Caretaker profile not found",
      });
    }
    // console.log("Caretaker.userId",caretaker.userId);
    // --- SECURITY LOGIC ---
    // 1. If the caretaker is looking at their own profile, let them see it regardless of visibility.
    // 2. If it's someone else, they can ONLY see it if visibility is "public".
    const isOwner = caretaker.userId.toString() === requestorId;
    
    if (!isOwner && caretaker.visibility !== "public") {
      return res.status(403).json({
        success: false,
        message: "This profile is private or restricted.",
      });
    }

    return res.status(200).json({
      success: true,
      caretaker,
    });
  } catch (error) {
    console.error("getCaretakerProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching caretaker profile",
    });
  }
}; 

export const getCaretaker = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    console.log("req.user.id, req.user._id:", req.user.id,req.user._id );

    // 2. Query the Caretaker collection
    // We look for the document where 'userId' matches the logged-in User's _id
    const caretaker = await Caretaker.findOne({ userId });

    console.log("Caretaker document found:", caretaker);

    if (!caretaker) {
      return res.status(404).json({
        success: false,
        message: "Caretaker profile not found. Please complete your profile setup.",
      });
    }

    // 3. Success response
    return res.status(200).json({
      success: true,
      caretaker,
    });
  } catch (error) {
    // This catches the "reference error" if you used undefined variables
    console.error("getCaretakerProfile error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching caretaker profile",
    });
  }
};
/* =====================================================
   GET SINGLE PARENT PROFILE
===================================================== */
export const getParentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const caretakerUserId = req.user.id;
    // console.log("req.params Id and req.user.id",id, caretakerUserId);
    const parent = await Parent.findOne({
      $or: [{ _id: id }, { userId: id }],
    }).lean();

    if (!parent) {
      return res.status(404).json({ success: false, message: "Parent not found" });
    }

    // 2. FIX: Find the Caretaker's PROFILE ID first
    const caretakerProfile = await Caretaker.findOne({ userId: caretakerUserId });

    // 3. Check for an ACCEPTED booking using the Profile ID
    let hasBooking = false;
    if (caretakerProfile) {
      hasBooking = await Booking.findOne({
        parentId: parent._id,
        caretakerId: caretakerProfile._id, // Use the Profile _id, not the User ID
        status: "ACCEPTED"
      });
    }

    // 3. IMPROVEMENT: Privacy Logic
    // If no accepted booking, hide the address and phone
    const sanitizedParent = { ...parent };
    
    if (!hasBooking) {
      delete sanitizedParent.address;
      delete sanitizedParent.phone;
      sanitizedParent.isLocked = true; // Tell frontend that contact info is hidden
    }

    return res.status(200).json({ 
      success: true, 
      parent:sanitizedParent, 
      message : !hasBooking ? "Full contact details hidden until booking is accepted." : "Full profile access granted."
    });
  } catch (err) {
    console.error("getParentProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching parent profile" });
  }
};

/**
 * ================================
 * GET ALL PARENT CARDS (FOR CARETAKER VIEW)
 * ================================
 * - Optional feature: caretaker browsing parents
 * - Does NOT replace booking flow
 */
export const getAllParentCards = async (req, res) => {
  try {
    const parents = await Parent.find()
      .select("fullName city numberOfChildren kidsAges photo babysittingLocation")
      .lean();

    return res.status(200).json({
      success: true,
      parents,
    });
  } catch (error) {
    console.error("getAllParentCards error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching parents",
    });
  }
};

