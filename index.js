// Import required modules and packages
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connection } from "./config/database.js";
import shareHolderRouter from "./routes/shareHolders.js";
import { jwtAuthMiddleware } from "./controllers/authenticationControllers.js";

const app = express();
const port = process.env.PORT || 5000; // Use the environment port or 3000 by default

// Define middleware and routes
// app.use(express.json());

app.use(cors({ credentials: true }));
app.use(bodyParser?.json());
// app.use(jwtAuthMiddleware);

app.use("/api", shareHolderRouter);

// connect database
connection();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
