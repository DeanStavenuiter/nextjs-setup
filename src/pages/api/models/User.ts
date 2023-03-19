import { Schema, model, models } from "mongoose";

const userSchema = new Schema({

  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: [true, "Password is required."],
  },
  resetToken: {
    type: String,
    default: "",
  },
  resetTokenExpiry: {
    type: Date,
    default: null
  },
});

const User = models.User || model("User", userSchema);

export default User;
