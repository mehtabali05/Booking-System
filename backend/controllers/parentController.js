// backend/controllers/parentController.js
import Caretaker from "../models/Caretaker.js";
import Parent from "../models/Parent.js";
import Booking from "../models/Booking.js";

/* =====================================================
   GET ALL CARETAKER CARDS — Parent Dashboard
===================================================== */
export const getAllCaretakerCards = async (req, res) => { 
  try {
    const query = { visibility: "public", profileCompleted: true };
    const caretakers = await Caretaker.find(query)
      .select("fullName city rating photo hourlyRate skills education description")
      .lean();

    // const dto = caretakers.map(c => ({
    //   id: c._id,
    //   fullName: c.fullName,
    //   city: c.city,
    //   rating: c.rating || 0,
    //   photoUrl: c.profilePhoto || null,
    //   description: c.description || "",
    //   preferredLocation: c.preferredLocation || ""
    // }));

    return res.status(200).json({ 
      success: true, 
      caretakers
    });
  } catch (err) {
    console.error("getAllCaretakerCards error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error fetching caretakers"
    });
  }
};

/* =====================================================
   GET SINGLE CARETAKER PROFILE
===================================================== */
export const getCaretakerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const caretaker = await Caretaker.findOne({
      $or: [{ _id: id }, { userId: id }]
    });

    if (!caretaker || (caretaker.visibility !== "public" && caretaker.userId.toString() !== req.user.id)) {
      return res.status(404).json({ success: false, message: "Caretaker not found or profile is private" });
    }

    return res.status(200).json({ success: true, caretaker });
  } catch (err) {
    console.error("getCaretakerProfile error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error fetching caretaker profile"
    });
  }
};

/* =====================================================
   CREATE / UPDATE PARENT PROFILE
===================================================== */
// export const createParentProfile = async (req, res) => {
//   try {
//     const data = req.body || {};
//     const userId = req.user._id;
//     const {fullName,city} = req.body;
//     console.log("UserId parent",userId,fullName,city); 
//     console.log("Parent body",req.body); 
//     const profile = data.parent_profile || {};

//     if (!profile.fullName || !profile.city || !userId) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     } 

//     // Handle uploaded photo
//     const photoUrl = req.file ? `/uploads/parent/${req.file.filename}` : profile.photo || "";

//     const parentDoc = {
//       userId: userId,
//       fullName: profile.fullName,
//       city: profile.city,
//       address: profile.address || "",
//       phone: profile.phone || "",
//       // email: profile.email || "",
//       // availability: profile.availability || {},
//       numberOfChildren: Number(profile.numberOfChildren) || 0,
//       kidsAges: Array.isArray(profile.kidsAges) ? profile.kidsAges.map(Number) : [],
//       // babysittingSchedule: Array.isArray(profile.babysittingSchedule) ? profile.babysittingSchedule : [],
//       // hourlyRate: Number(profile.hourlyRate) || 0,
//       babysittingLocation: profile.babysittingLocation || "ourHome",
//       photo: photoUrl
//     };

//     // Upsert parent document
//     const parent = await Parent.findOneAndUpdate(
//       { userId: data.userId },
//       parentDoc,
//       { new: true, upsert: true, runValidators: true }
//     );

//     return res.status(201).json({ success: true, parent });
//   } catch (err) {
//     console.error("createParentProfile error:", err);
//     return res.status(500).json({ success: false, message: "Server error creating parent profile" });
//   }
// };

export const createParentProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    // console.log("req.user.id, : req.user._id", req.user.id, req.user._id);

    // --- FIX 1: Parse the stringified profile ---
    let profile = {};
    if (req.body.parent_profile) {
      try {
        profile = JSON.parse(req.body.parent_profile);
      } catch (e) {
        return res.status(400).json({ success: false, message: "Invalid profile data format" });
      }
    }

    // --- FIX 2: Validate using the parsed 'profile' object ---
    if (!profile.fullName || !profile.city || !userId) {
      console.log("Validation Failed:", { 
        name: profile.fullName, 
        city: profile.city, 
        userId 
      });
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Handle uploaded photo from Multer
    const photoUrl = req.file ? `/uploads/parent/${req.file.filename}` : profile.photo || "";

    // Prepare the document
    const parentDoc = {
      userId,
      fullName: profile.fullName,
      city: profile.city,
      address: profile.address || "",
      phone: profile.phone || "",
      // Clean up number conversions
      numberOfChildren: Number(profile.numberOfChildren) || 0, 
      kidsAges: Array.isArray(profile.kidsAges) ? profile.kidsAges.map(Number) : [],
      babysittingLocation: profile.babysittingLocation || "ourHome",
      photo: photoUrl
    };

    // --- FIX 3: Use the authenticated userId for the query to ensure security ---
    const parent = await Parent.findOneAndUpdate(
      { userId }, 
      parentDoc,
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(201).json({ 
      success: true, 
      message: "Profile updated successfully",
      parent 
    });

  } catch (err) {
    console.error("createParentProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
/* =====================================================
   GET SINGLE PARENT PROFILE
===================================================== */
export const getParentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const requestorId = req.user.id; 

    const parent = await Parent.findOne({
      $or: [{ _id: id }, { userId: id }]
    }).lean();

    if (!parent) {
      return res.status(404).json({ success: false, message: "Parent not found" });
    }

    // SECURITY: Only reveal contact info if the requestor is the owner OR a caretaker with an accepted booking
    const isOwner = parent.userId.toString() === requestorId;
    const caretaker = await Caretaker.findOne({ userId: requestorId });
    const hasBooking = caretaker
    ? await Booking.findOne({
        parentId: parent._id,
        caretakerId: caretaker._id,
        status: "ACCEPTED"
      })
    : null;

    const sanitizedParent = { ...parent };
    if (!isOwner && !hasBooking) {
      delete sanitizedParent.address;
      delete sanitizedParent.phone;
      sanitizedParent.contactRestricted = true;
    }

    return res.status(200).json({ 
      success: true, 
      parent:sanitizedParent 
    });
  } catch (err) {
    console.error("getParentProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching parent profile" });
  }
}; 

/* =====================================================
   GET ALL PARENT CARDS — normalize photoUrl
===================================================== */
// export const getAllParentCards = async (req, res) => {
//   try {
//     const parents = await Parent.find().select("-address -phone").lean(); // HIDE PRIVACY DATA
//     return res.status(200).json({ success: true, parents });
//   } catch (err) {
//     console.error("getAllParentCards error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

