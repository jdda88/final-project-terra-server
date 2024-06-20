import { Schema, model } from "mongoose";

const planSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    cities: [{ type: String, required: false }],
    stats: {
      type: String,
      officialLanguage: { type: String },
      population: { type: String },
      capitalCity: { type: String },
      currency: { type: String },
      powerOutlet: { type: String },
    },
    images: [
      {
        type: String,
      },
    ],
    content: { type: String, required: true, maxLength: 10000 },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
  }
);

export default model("Plan", planSchema);
