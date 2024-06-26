import { Schema, model } from "mongoose";
// ;;daniel was here
//another comment from daniel
const reviewSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxLength: 64 },
    review: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500,
      minLength: 10,
    },
    plans: { type: Schema.Types.ObjectId, ref: "Plans", required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default model("Review", reviewSchema);
