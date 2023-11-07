import express from "express";
import {
  getShareDetail,
  createShareDetails,
  createShareholders,
  updateShareDetails,
} from "../controllers/index.js";
import { ShareDetail } from "../models/index.js";

const router = express?.Router();

// Route to add shareholders to the system
router.post("/addShareholder", createShareholders);

// Route to set share details for a shareholder
router.post("/setShareDetails/:shareholderId", createShareDetails);

router.put("/updateshareDetails/:shareDetailId", updateShareDetails);

router.get("/share/:shareholderId/details", getShareDetail);

// Route to display a summary list of all shareholders
router.get("/shareholdersSummary", async (req, res) => {
  const specificDate = new Date("2000-01-02T00:00:00.000Z");
  const shareDetail = await ShareDetail.aggregate([
    { $unwind: "$installments" }, // Unwind the installments array
    {
      $match: {
        "installments.installmentDate": specificDate, // Filter by the specific date
      },
    },
    {
      $lookup: {
        from: "shareholders", // Name of the Shareholder collection
        localField: "shareholder",
        foreignField: "_id",
        as: "shareholderDetails",
      },
    },
    {
      $project: {
        shareholder: { $arrayElemAt: ["$shareholderDetails", 0] }, // Consider the first element as the shareholder
        installments: 1,
      },
    },
  ]);
  res.json(shareDetail).status(200);
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
