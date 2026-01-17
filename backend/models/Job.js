// backend/models/Job.js
import mongoose from "mongoose";

const allowedJobTypes = ["babysitting", "tutoring", "petCare", "other"];
const allowedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const JobSchema = new mongoose.Schema(
  {
    parentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Parent", 
      required: [true, "Parent ID is required"] 
    },
    title: { 
      type: String, 
      required: [true, "Job title is required"], 
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, "Job description is required"], 
      trim: true 
    },
    budgetPerHour: { 
      type: Number, 
      required: [true, "Budget per hour is required"], 
      min: [0, "Budget cannot be negative"] 
    },
    jobType: { 
      type: String, 
      enum: {
        values: allowedJobTypes,
        message: "Invalid job type"
      },
      default: "other"
    },
    workDays: {
      type: [String],
      validate: {
        validator: (days) => days.every(d => allowedDays.includes(d)),
        message: "Invalid day in workDays array"
      },
      default: []
    },
    workHours: { 
      type: String, 
      trim: true,
      default: ""
      // Optional: can add regex validation like /^\d{2}:\d{2}-\d{2}:\d{2}$/ for HH:MM-HH:MM
    },
    city: { 
      type: String, 
      required: [true, "City is required"], 
      trim: true 
    },
    status: { 
      type: String, 
      enum: ["open", "applied", "booked", "closed"], 
      default: "open" 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
