// Import required modules and packages
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.js";
import auth from "./routes/authentication.js";
import { connection } from "./config/database.js";
import shareHolderRouter from "./routes/shareHolders.js";
import { jwtAuthMiddleware } from "./controllers/authenticationControllers.js";

const app = express();
const port = process.env.PORT || 5000; // Use the environment port or 3000 by default

// Define middleware and routes
// app.use(express.json());

// connect database
connection();

app.use(cors({ credentials: true }));
app.use(bodyParser?.json());
app.use("/api", jwtAuthMiddleware);

app.use("/auth", auth);
app.use("/api/profile", userRoutes);
app.use("/api/shareholder", shareHolderRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
