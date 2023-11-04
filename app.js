// Import required modules and packages
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import shareHolderRouter from "./routes/shareHolders.js";
import { connection } from "./config/database.js";

const app = express();
const port = process.env.PORT || 3000; // Use the environment port or 3000 by default

// Define middleware and routes
// app.use(express.json());

app.use(
  cors({
    credentials: true,
  })
);

app.use(bodyParser?.json());

app.use("/api", shareHolderRouter);

// Start the server
connection();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
