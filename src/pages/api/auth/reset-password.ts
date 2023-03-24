import type { NextApiRequest, NextApiResponse } from "next";
import connectMongoDB from "../../../../db/connectMongoDB";
import User from "../models/User";
import bcrypt from "bcrypt";

export const resetPasswordHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const verifyResetToken = async (token: string) => {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(500)
        .json({ message: "Invalid or expired reset token" });
    }
    return user;
  };

  const updatePassword = async (userId: string, password: string) => {
    try {
      const user = await User.findById(userId);
      const salt = bcrypt.genSaltSync(12);

      if (!user) {
        return res.status(500).json({ message: "User not found" });
      }

      user.passwordHash = bcrypt.hashSync(password, salt);
      user.resetToken = null;
      user.resetTokenExpiry = null;

      await user.save();
    } catch (err) {
      console.error(err);
      throw new Error("Error updating password");
    }
  };

  if (req.method === "POST") {
    const { token, password } = req.body;

    try {
      await connectMongoDB();
      const userId = token;
      await verifyResetToken(token);
      await updatePassword(userId, password);
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error });
    }
  }
};

export default resetPasswordHandler;
