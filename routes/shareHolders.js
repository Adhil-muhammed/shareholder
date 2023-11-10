import express from "express";
import {
  addShareDetailsToShareholder,
  createShareholders,
  updateShareDetails,
  getShareDetailByDate,
  getShareDetailByShareholder,
} from "../controllers/index.js";

const router = express?.Router();

// Route to add shareholders to the system
router.post("/", createShareholders);

// Route to set share details for a shareholder
router.post("/setShareDetails/:shareholderId", addShareDetailsToShareholder);

router.put("/:shareDetailId", updateShareDetails);

router.get("/shareDetails/:shareholderId", getShareDetailByShareholder);

// Route to display a summary list of all shareholders and their sharedetails
router.get("/shareDetailsByDate", getShareDetailByDate);

// Route to display details of an individual shareholder
router.get("/:shareholderId", (req, res) => {
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
