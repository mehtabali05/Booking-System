import express from "express";
import {
  getMyChats,
  getChatById,
  sendMessage,
  getUnreadMessageCount,
} from "../controllers/chatController.js";

import authMiddleware from "../middlewares/authenticateUser.js";

const router = express.Router();

// Get all chats for logged-in user
router.get("/", authMiddleware, getMyChats);



// Send message
router.post("/:chatId/message", authMiddleware, sendMessage);

//  Unread Count
router.get(
  "/unread-count",
  authMiddleware,
  getUnreadMessageCount
);

// Get single chat
router.get("/:chatId", authMiddleware, getChatById);
 
export default router;
