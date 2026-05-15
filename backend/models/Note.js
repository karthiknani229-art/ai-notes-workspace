import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,

    title: {
      type: String,
      default: "Untitled Note",
    },

    content: String,

    tags: {
      type: [String],
      default: [],
    },

    archived: {
      type: Boolean,
      default: false,
    },

    aiSummary: String,

    aiActionItems: {
      type: [String],
      default: [],
    },

    aiSuggestedTitle: String,

    isPublic: {
      type: Boolean,
      default: false,
    },

    shareId: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Note",
  noteSchema
);