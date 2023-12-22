import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const tempKey = "qawsedrftgyh";

export const jwtAuthMiddleware = (req, res, next) => {
  // Retrieve the token from the request header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed (no token)" });
  }
  try {
    jwt.verify(token, tempKey, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          console.log("TokenExpiredError");
          return res.status(401).json({ message: "Token has expired" });
        } else {
          return res.status(401).json({ message: err?.message });
        }
      } else {
        req.user = decoded;
        next(); // Continue to the protected route if the token is valid
      }
    });
  } catch (error) {
    console.log("error: middlewer", error);
    return res.status(500).json({ message: "server Authentication error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res
      .status(401)
      .json({ message: "Authentication failed. User not found" });
  }

  const passwordMatch = await bcrypt.compare(password, user?.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Authentication failed." });
  }

  const token = jwt.sign(
    { username: user.username, userId: user._id },
    tempKey,
    { expiresIn: 3600 }
  );
  res.status(200).json({ token });
};

export const signup = async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user and save it to the database
  const user = new User({ email, username, password: hashedPassword });
  await user.save();

  res.status(201).json({ message: "User created successfully" });
};
