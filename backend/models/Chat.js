import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // ONE chat per booking
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required: true,
    },
    caretakerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caretaker",
      required: true,
    },
    messages: [
      {
        sender: {
          type: String,
          enum: ["PARENT", "CARETAKER"],
          required: true
        },
        text: {
          type: String,
          required: true
        },
        readBy: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          }
        ],
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
    
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
