import Joi from "joi";
import moment from "moment";
import { ShareDetail, Shareholder } from "../models/index.js";
import { createInstallments, getInstallmentsPerYear } from "../utils/index.js";
import {
  shareDetailsValidation,
  updateShareDetailValidation,
} from "../validations/index.js";

export const createShareDetails = async (req, res) => {
  try {
    const { duration, startDate, annualAmount, installmentType } = req.body;
    const shareDetailvalidationSchema = await shareDetailsValidation();

    const installmentsPerYear = getInstallmentsPerYear(installmentType);

    const installmentAmount = annualAmount / installmentsPerYear;

    const totalInstallmentAmount =
      installmentAmount * (duration * installmentsPerYear);

    const installments = createInstallments(
      duration,
      startDate,
      installmentType,
      installmentAmount,
      installmentsPerYear
    );

    const { shareholderId } = req.params;
    const shareholder = await Shareholder.findById(shareholderId);
    const { error } = shareDetailvalidationSchema.validate(req.body);

    if (error) {
      const errorMessage = error?.details[0]?.message;
      return res.status(400).json({ error: errorMessage });
    }

    if (!shareholder) {
      return res.status(404).json({ error: "Shareholder not found" });
    }
    const newShareDetail = new ShareDetail({
      shareholder: shareholder._id,
      duration,
      startDate,
      annualAmount,
      installmentType,
      installmentAmount,
      totalInstallmentAmount,
      installments,
      // other fields...
    });
    const savedDetail = await newShareDetail.save();
    res.status(201).json(savedDetail);
  } catch (error) {
    console.error("error: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateShareDetails = async (req, res) => {
  try {
    const { shareDetailId } = req.params;

    const currentTime = new Date();
    const shareDetails = await ShareDetail.findOne({ _id: shareDetailId });

    const fixedDate = moment(shareDetails?.startDate);

    const instalmentEndDate = fixedDate
      .clone()
      .add(shareDetails?.duration, "years");

    const updateSchema = updateShareDetailValidation(shareDetails);

    const { error, value } = updateSchema.validate(req.body);

    if (error) {
      const errorMessage = error?.details[0]?.message;
      return res.status(400).json({ error: errorMessage });
    }

    const updatedDetails = await ShareDetail?.findByIdAndUpdate(
      { _id: shareDetailId },
      {
        installments: value?.installments,
        installmentType: value?.installmentType,
        durationEndDate: moment(instalmentEndDate)?.format(
          "MMMM D, YYYY, h:mm a"
        ),
        updatedAt:
          moment(value.updatedAt)?.format("MMM D, YYYY, h:mm a") || currentTime,
      },
      { new: true }
    );

    res.status(200).json(updatedDetails);
  } catch (error) {
    console.error("error: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getShareDetailByShareholder = async (req, res) => {
  try {
    const { shareholderId } = req.params;

    const shareDetails = await ShareDetail.find({
      shareholder: shareholderId,
    }).populate("shareholder");

    res.status(200).json(shareDetails);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getShareDetailByDate = async (req, res) => {
  try {
    const dateSchema = Joi.string().isoDate().required();
    const { error, value: filterDate } = dateSchema.validate(req?.query?.date);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const shareDetail = await ShareDetail.aggregate([
      { $unwind: "$installments" }, // Unwind the installments array
      {
        $match: {
          "installments.installmentDate": new Date(filterDate), // Filter by the specific date
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

    if (shareDetail?.length) {
      res.json(shareDetail).status(200);
    } else {
      res.json({ message: "No data found for the specific date" }).status(404);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
