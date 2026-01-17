
import express from "express";
import {
  getAllParentCards,
  getAllCaretakerCards,
  getCaretakerProfile,
  upsertCaretakerProfile,
  // getAllParentJobCards, 
  getParentProfile,
  getCaretaker,
} from "../controllers/caretakerController.js";

import authenticate from "../middlewares/authenticateUser.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import uploadCaretaker from "../middlewares/uploadCaretaker.js";

const router = express.Router(); 
 
/* =====================================================
   CARETAKER DASHBOARD - GET ALL PARENT CARDS
   Only caretakers can access this
===================================================== */
router.get(
  "/parents",
  authenticate,
  authorizeRole("caretaker"),
  getAllParentCards
); 

/* =====================================================
   CARETAKER DASHBOARD - GET SINGLE PARENT PROFILE
===================================================== */
router.get(
  "/parents/:id",
  authenticate,
  authorizeRole("caretaker"),
  getParentProfile
);

/* =====================================================
   CARETAKER PROFILE - CREATE OR UPDATE
===================================================== */
router.post( 
  "/profile",
  authenticate,
  authorizeRole("caretaker"),
  // uploadCaretaker.single("photo"), // Multer for profile photo upload
  upsertCaretakerProfile
); 

/* =====================================================
   CARETAKER PROFILE - GET SINGLE CARETAKER
===================================================== */
router.get(
  "/me",
  authenticate,
  authorizeRole("caretaker"),
  getCaretaker
);

/* =====================================================
   CARETAKER PROFILE - GET SINGLE CARETAKER
===================================================== */
router.get( 
  "/profile/:id",
  authenticate,
  authorizeRole("caretaker","parent"),
  getCaretakerProfile 
);

/* =====================================================
   CARETAKER DASHBOARD - GET ALL CARETAKER CARDS
   Public or parent-only view
===================================================== */
router.get( 
  "/",
  authenticate, 
  authorizeRole("parent", "admin"), // parents can see caretaker cards
  getAllCaretakerCards
);



router.post(
  "/upload-photo",
  authenticate,
  authorizeRole("caretaker"),
  (req, res) => {
    uploadCaretaker.single("photo")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Image upload error",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      return res.status(200).json({
        success: true,
        filePath: `/uploads/caretaker/${req.file.filename}`,
      });
    });
  }
);


export default router;
