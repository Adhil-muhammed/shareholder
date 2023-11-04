import express from "express";
import { Shareholder, schema } from "../models/shareHolderModal.js";

const router = express?.Router();

// Route to add shareholders to the system
router.post("/addShareholder", async (req, res) => {
  try {
    const isUsernameUnique = await Shareholder.exists({
      email: req?.body?.email,
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    if (isUsernameUnique) {
      return res.status(409).json({ error: "email is not unique" });
    }

    const newShareholder = new Shareholder(req.body); // Create a new Shareholder instance

    const savedUser = await newShareholder?.save();
    // Save the shareholder to the database

    return res.json({ message: "Shareholder added successfully", savedUser });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add shareholder", message: error?.message });
  }
});

// Route to set share details for a shareholder
router.post("/setShareDetails/:shareholderId", (req, res) => {
  // Implement setting share details logic here
});

// Route to display a summary list of all shareholders
router.get("/shareholdersSummary", (req, res) => {
  // Implement logic to calculate and return summary data
});

// Route to display details of an individual shareholder
router.get("/shareholder/:shareholderId", (req, res) => {
  // Implement logic to retrieve and return individual shareholder details
});

// Route to search for a shareholder by email and get details
router.get("/searchShareholder/:email", (req, res) => {
  // Implement logic to search for a shareholder by email and return their details
  res?.send(
    `hi this is the mail id  for the shareholder:- ${req?.params.email}`
  );
});

// Route to generate an Excel report based on search results
router.get("/generateExcelReport", (req, res) => {
  // Implement logic to generate an Excel report based on search results
});

export default router;
