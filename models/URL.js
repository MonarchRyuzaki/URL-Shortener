import mongoose from "mongoose";
const { Schema, model } = mongoose;

const urlSchmea = new Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      unique: true,
    },
    shortUrlKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 60 * 60 * 24 * 7 * 1000,
      expires: 0,
    },
  },
  { timestamps: true }
);
const URL = model("URL", urlSchmea);
export default URL;
