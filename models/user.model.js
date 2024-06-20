import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
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
    //   add reviews schema as user and admin here
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);
