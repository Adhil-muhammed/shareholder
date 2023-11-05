import Joi from "joi";
import moment from "moment";
import { ShareDetail, Shareholder } from "../models/index.js";
import {
  checkDate,
  createInstallments,
  validateTotalAmount,
  getInstallmentsPerYear,
} from "../utils/index.js";

export const createShareDetails = async (req, res) => {
  try {
    const { duration, startDate, annualAmount, installmentType } = req.body;

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
    const { installments, installmentType } = req.body;
    const { shareDetailId } = req.params;

    const currentTime = new Date();
    const shareDetails = await ShareDetail.findOne({ _id: shareDetailId });

    const fixedDate = moment(shareDetails?.startDate, "YYYY-MM-DD");

    const instalmentEndDate = fixedDate
      .clone()
      .add(shareDetails?.duration, "years");

    const updateSchema = Joi.object({
      installmentType: Joi.string().equal("custom"),
      installments: Joi.array()
        .items(
          Joi.object({
            amount: Joi.number().required().messages({
              "number.base": "Amount must be a valid number",
              "any.required": "Amount is required",
            }),
            installmentDate: Joi.date()?.custom((value, helper) =>
              checkDate(value, helper, shareDetails)
            ),
            installmentNumber: Joi.number(),
          })
        )
        .custom((value, helpers) =>
          validateTotalAmount(value, helpers, shareDetails)
        ),
      updatedAt: Joi.date(),
    });

    const { error, value } = updateSchema.validate(req.body);

    if (error) {
      const errorMessage = error?.details[0]?.message;
      return res.status(400).json({ error: errorMessage });
    }

    const updatedDetails = await ShareDetail?.findByIdAndUpdate(
      { _id: shareDetailId },
      {
        installments: value?.installments,
        duratioEndDate: installmentType,
        duratioEndDate: moment(instalmentEndDate)?.format("YYYY-MM-DD"),
        updatedAt: value.updatedAt || currentTime,
      },
      { new: true }
    );

    res.status(200).json(updatedDetails);
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
