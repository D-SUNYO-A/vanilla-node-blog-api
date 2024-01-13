import mongoose from "mongoose";
import { Schema } from "mongoose";

// Object Schema
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Object Model
export const Post = mongoose.model("Post", postSchema);
