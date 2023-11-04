import moment from "moment";
import { createInstallments, getInstallmentsPerYear } from "../utils/index.js";
import { ShareDetail, Shareholder } from "../models/index.js";

export const createShareDetails = async (req, res) => {
  // Implement setting share details logic here
  try {
    const { duration, annualAmount, installmentType, startDate } = req.body;

    const installmentsPerYear = getInstallmentsPerYear(installmentType);

    // Calculate the total installment amount based on the provided data
    const installmentAmount = annualAmount / installmentsPerYear;
    const totalInstallmentAmount =
      installmentAmount * (duration * installmentsPerYear);

    const installments = createInstallments(
      duration,
      startDate,
      installmentAmount,
      installmentsPerYear
    );

    const { shareholderId } = req.params;
    const shareholder = await Shareholder.findById(shareholderId);

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

export const getShareDetail = async (req, res) => {
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
