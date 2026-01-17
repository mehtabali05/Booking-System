// backend/models/subSchemas/availabilitySchema.js
import mongoose from "mongoose";

const daySchema = {
  Mo: Boolean,
  Tu: Boolean,
  We: Boolean,
  Th: Boolean,
  Fr: Boolean,
  Sa: Boolean,
  Su: Boolean,
};

export const availabilitySchema = new mongoose.Schema(
  {
    Morning: daySchema,
    Afternoon: daySchema,
    Evening: daySchema,
    Night: daySchema,
  },
  { _id: false }
);
