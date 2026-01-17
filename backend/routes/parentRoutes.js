// const express = require("express");
// const uploadParent = require("../middleware/uploadParent");
// const {
//   createParentProfile,
//   getAllCaretakerCards,
//   getCaretakerProfile,
//   getParentProfile,
//   getAllParentCards
// } = require("../controllers/parentController");

// const router = express.Router();


// router.get("/cards", getAllParentCards); 

// // ------------------ Parent profile ------------------
// router.post("/create", uploadParent.single("photo"), createParentProfile);
// router.get("/:id", getParentProfile);

// // ------------------ Caretaker cards for Parent Dashboard ------------------
// router.get("/caretakers/all", getAllCaretakerCards);
// router.get("/caretaker/:id", getCaretakerProfile);

// module.exports = router;


import express from "express";
import {
  getAllCaretakerCards, 
  getCaretakerProfile,
  createParentProfile,
  getParentProfile,
  // getAllParentCards,
} from "../controllers/parentController.js";

import authenticateUser from "../middlewares/authenticateUser.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import uploadParent from "../middlewares/uploadParent.js";

const router = express.Router(); 

/* =====================================================
   PARENT DASHBOARD - CARETAKER CARDS
   Accessible only to authenticated parent
===================================================== */
router.get( 
  "/caretakers",
  authenticateUser,               // ensure user is logged in
  authorizeRole("parent"),   // restrict to parent role
  getAllCaretakerCards
); 

/* =====================================================
   PARENT DASHBOARD - SINGLE CARETAKER PROFILE
===================================================== */
router.get(
  "/caretakers/:id",
  authenticateUser,
  authorizeRole("parent"),
  getCaretakerProfile
);

/* =====================================================
   CREATE OR UPDATE PARENT PROFILE
===================================================== */
router.post( 
  "/profile",
  authenticateUser,
  authorizeRole("parent"),
  uploadParent.single("photo"), // multer middleware for photo upload
  createParentProfile
);
 
/* =====================================================
   GET SINGLE PARENT PROFILE
===================================================== */
router.get(
  "/profile/:id",
  authenticateUser,
  authorizeRole("parent","caretaker","admin"),
  getParentProfile
);

/* =====================================================
   GET ALL PARENT CARDS
   (Admin / optional for dashboard listings)
===================================================== */
// router.get(
//   "/",
//   authenticateUser,
//   authorizeRole("admin"), // only admin can fetch all parents
//   getAllParentCards
// );

export default router;
 