import type { NextApiRequest, NextApiResponse } from "next";
import connectMongoDB from "../../../../db/connectMongoDB";
import User from "../models/User";
import nodemailer from "nodemailer";

export const forgotPasswordHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const generateResetToken = async (email: string) => {

    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(500).json({ message: "User not found" });
      }
      const resetToken = user._id;

      user.resetToken = user._id;
      user.resetTokenExpiry = Date.now() + 900000; // 15min
      await user.save();
      return resetToken;
    } catch (error) {
      console.log(error);
    }
  };

  const sendPasswordResetEmail = async (email: string, resetToken: string) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.APP_PWD}`, // link: https://support.google.com/accounts/answer/185833?hl=en
      },
    });

    const resetUrl = `http://localhost:5173/reset/user/${resetToken}`;
    const message = {
      from: "",
      to: email,
      subject: "Password reset request",
      html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
    };
    await transporter.sendMail(message);
  };

  if (req.method === "POST") {
    const { email } = req.body;

    try {
      await connectMongoDB();
      const resetToken = await generateResetToken(email);
      await sendPasswordResetEmail(email, resetToken);
      return res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "User not found" });
    }
  }
};

export default forgotPasswordHandler;
