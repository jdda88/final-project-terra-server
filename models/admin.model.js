import { Schema, model } from "mongoose";

const adminSchema = new Schema(
  {
    name: { type: String, required: true },
    username: {
      type: String,
      uniqe: true,
      required: true,
      maxLength: 25,
      minLength: 4,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      maxLength: 40,
      trim: true,
    },
    password: { type: String, required: true, minLength: 6 },
    profilePic: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg",
    },
    aboutMe: { type: String, maxLength: 800, minLength: 100, required: true },

    isAdmin: { type: Boolean, default: true }, // Set to true for admin accounts
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);
