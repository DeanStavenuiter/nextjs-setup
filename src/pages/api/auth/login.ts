import type { NextApiRequest, NextApiResponse } from "next";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectMongoDB from "../../../../db/connectMongoDB";

export const loginHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await connectMongoDB();
  const { email, password } = req.body;
  console.log(req.body)

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide valid email and password" });
    return;
  }
  try {
    const matchedUser = await User.findOne({ email });

    if (!matchedUser) {
      res.status(401).json({ message: "User not found." });
      return;
    }

    if (bcrypt.compareSync(password, matchedUser.passwordHash)) {
      const payload = {
        id: matchedUser._id,
        email: matchedUser.email,
      };

      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
        algorithm: "HS256",
        expiresIn: "6h",
      });

      res.status(200).json({ authToken: authToken });
    } else {
      res.status(401).json({ message: "Password incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export default loginHandler;
