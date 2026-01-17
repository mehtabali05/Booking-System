import Chat from "../models/Chat.js";
import Notification from "../models/Notification.js";
import Booking from "../models/Booking.js";
import Parent from "../models/Parent.js";
import Caretaker from "../models/Caretaker.js";

/**
 * GET all chats for logged-in user
 * Parent → sees chats where parentId = req.user.id
 * Caretaker → sees chats where caretakerId = req.user.id
 */
export const getMyChats = async (req, res) => {
  try {
    const userId = req.user.id  || req.user._id;
    const role = req.user.role.toUpperCase();
    
    let profileId;

    // 1. Get the Profile ID based on role
    if (role === "PARENT") {
      const parent = await Parent.findOne({ userId });
      profileId = parent?._id;
    } else {
      const caretaker = await Caretaker.findOne({ userId });
      profileId = caretaker?._id;
    }
    

    if (!profileId) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    // 2. Filter using the Profile ID, not the User Account ID
    const filter =
    role === "PARENT"
      ? { parentId: profileId }
      : { caretakerId: profileId };

    const chats = await Chat.find(filter)
      .populate("parentId", "fullName")
      .populate("caretakerId", "fullName")
      .populate("bookingId", "status")
      .sort({ updatedAt: -1 });

    // Calculate unread count for each chat before sending to frontend
    const chatsWithUnreadCount = chats.map(chat => {
      const chatObj = chat.toObject();
      chatObj.unreadCount = chat.messages.filter(msg => 
        !msg.readBy.map(id => id.toString()).includes(userId.toString())
      ).length;
      
      // Also attach the profileId so frontend knows who is "isParent"
      chatObj.currentProfileId = profileId; 
      return chatObj;
    });  

    res.json({ success: true, chats : chatsWithUnreadCount });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });
  }
};

/**
 * GET single chat by ID
 */

export const getChatById = async (req, res) => {
  try {
    const userId = req.user._id;
    const chat = await Chat.findById(req.params.chatId)
      .populate("parentId caretakerId bookingId");

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    // Mark messages as read
    chat.messages.forEach((msg) => {
      if (!msg.readBy.includes(userId)) {
        msg.readBy.push(userId);
      }
    });

    await chat.save();

    res.json({ success: true, chat });
  } catch (err) {
    console.error("getChatById error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/**
 * SEND MESSAGE
 */
export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;

    const userId = req.user._id;
    const role = req.user.role.toUpperCase();

    // const chat = await Chat.findById(chatId);
    const chat = await Chat.findById(chatId).populate("bookingId");
    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    // ❌ Prevent chat if booking is not active
    // if (chat.bookingStatus !== "ACCEPTED") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Chat is disabled for this booking",
    //   });
    // }

    if (!chat.bookingId || chat.bookingId.status !== "ACCEPTED") {
      return res.status(403).json({
        success: false,
        message: "Chat is disabled for this booking",
      });
    }

    // 1️⃣ Save message
    const message = {
      sender: role,
      text,
      readBy: [userId],
      timestamp: new Date(),
    };

    chat.messages.push(message);
    await chat.save();

    // 2️⃣ Identify RECEIVER
    // const receiverUserId =
    //   role === "PARENT" ? chat.caretakerUserId : chat.parentUserId;
    const receiverUserId =
      role === "PARENT" ? chat.caretakerId : chat.parentId;

    // 3️⃣ Create notification for RECEIVER
    await Notification.create({
      userId: receiverUserId,
      message:
        role === "PARENT"
          ? "New message from Parent"
          : "New message from Caretaker",
      bookingId: chat.bookingId._id,
    }); 

    return res.status(200).json({
      success: true,
      message: "Message sent",
    });
  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error sending message",
    });
  }
};



// export const getUnreadMessageCount = async (req, res) => {
//   try {
//     const userId = req.user.id || req.user._id;
//     const role = req.user.role.toUpperCase();

//     const chats = await Chat.find({
//       $or: [
//         { parentId: role === "PARENT" ? req.user.profileId : null },
//         { caretakerId: role === "CARETAKER" ? req.user.profileId : null }
//       ]
//     });

//     let unreadCount = 0;

//     chats.forEach(chat => {
//       chat.messages.forEach(msg => {
//         if (
//           msg.sender !== role &&
//           !msg.readBy.includes(userId)
//         ) {
//           unreadCount++;
//         }
//       });
//     });

//     res.json({ success: true, unreadCount });
//   } catch (err) {
//     console.error("Unread count error:", err);
//     res.status(500).json({ success: false });
//   }
// };

export const getUnreadMessageCount = async (req, res) => {
  try {
    // 1. Standardize the User ID
    const userId = req.user.id || req.user.id;
    // console.log("UserId",userId);
    if (!userId) {
        return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    
    const role = req.user.role.toUpperCase();

    // 2. Find the correct Profile ID
    let profile;
    if (role === "PARENT") {
      profile = await Parent.findOne({ userId: userId });
    } else {
      profile = await Caretaker.findOne({ userId: userId });
    }

    // If no profile exists, unread count is naturally 0
    if (!profile) {
      return res.json({ success: true, unreadCount: 0 });
    }

    // 3. Find all chats where this profile is a participant
    const filter = role === "PARENT" 
      ? { parentId: profile._id } 
      : { caretakerId: profile._id };

    const chats = await Chat.find(filter);
    // console.log("Chat ",chats)
    let totalUnread = 0;

    // 4. Loop through chats and count unread messages
    chats.forEach(chat => {
      if (chat.messages && chat.messages.length > 0) {
        chat.messages.forEach(msg => {
          // A message is unread if:
          // - It wasn't sent by the current user's role
          // - The current userId is NOT in the readBy array
          const hasRead = msg.readBy.some(id => id.toString() === userId.toString());
          
          if (msg.sender !== role && !hasRead) {
            totalUnread++;
          }
        });
      }
    });

    return res.status(200).json({ 
      success: true, 
      unreadCount: totalUnread 
    });

  } catch (err) {
    console.error("Detailed Unread count error:", err); // This will show the real error in your terminal
    return res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: err.message // Temporary: helps you see the error in the Network tab
    });
  }
};

export const createChatForBooking = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return null;

    // Check if chat already exists
    let chat = await Chat.findOne({ bookingId });
    if (chat) return chat;

    chat = await Chat.create({
      bookingId,
      parentId: booking.parentId,
      caretakerId: booking.caretakerId,
      messages: [],
    });

    return chat;
  } catch (err) {
    console.error("Error creating chat for booking:", err);
    return null;
  }
};


