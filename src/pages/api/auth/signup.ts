import type { NextApiRequest, NextApiResponse } from "next";
import connectMongoDB from "../../../../db/connectMongoDB";
import User from "../models/User";
import bcrypt from "bcrypt";
import EmailValidator from "email-validator";

type Data = {
  name: string;
};

export const signupHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { email, password, repeatPassword } = req.body;

  if (req.method === "POST") {

    if (!email && !password && !repeatPassword){
      res.status(400).json({ message: "Provide a valid email and a valid password" });
      return;
    }

    if (!email) {
      res.status(400).json({ message: "Provide a valid email" });
      return;
    }

    if (!password) {
      res.status(400).json({ message: "Provide a valid password" });
      return;
    }

    if (!repeatPassword){
      res.status(400).json({ message: "Repeat your password" });
      return;
    }

    if (password !== repeatPassword) {
      res.status(400).json({ message: "Your passwords are not the same" });
      return;
    }

    const isValid = EmailValidator.validate(email);

    if (!isValid) {
      res.status(400).json({ message: "Provide a valid email." });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
      return;
    }

    try {
      const matchUser = await User.findOne({ email });

      if (matchUser) {
        return res.status(400).json({ message: "Email already in use." });
      }

      const salt = bcrypt.genSaltSync(13);
      const passwordHash = bcrypt.hashSync(password, salt);
      const newUser = await User.create({ email, passwordHash });
      const response = { email: newUser.email, id: newUser._id };

      res.status(201).json({message: "Sign up was successful", response});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Oeps something went wrong" });
    }
  }
};

export default signupHandler;
