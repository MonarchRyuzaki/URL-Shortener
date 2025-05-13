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
  },
  { timestamps: true }
);
const URL = model("URL", urlSchmea);
export default URL;
