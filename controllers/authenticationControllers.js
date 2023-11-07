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
    // Verify the token using your secret key
    const decoded = jwt.verify(token, tempKey);
    // Attach user information to the request for use in protected routes
    req.user = decoded;
    next(); // Continue to the protected route if the token is valid
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authentication failed (invalid token)" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  // Generate a JWT token
  const token = jwt.sign(
    { username: user.username, userId: user._id },
    tempKey, // Replace with a strong, unique secret key
    { expiresIn: "1h" }
  );

  res.status(200).json({ token });
};

export const signup = () => {
  router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save it to the database
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  });
};
