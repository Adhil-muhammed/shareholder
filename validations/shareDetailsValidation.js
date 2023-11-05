import Joi from "joi";
import { checkDate, validateTotalAmount } from "../utils/index.js";

export const shareDetailsValidation = async () => {
  return Joi.object({
    duration: Joi.number().integer().min(1).required().messages({
      "number.base": "Duration must be a number",
      "number.integer": "Duration must be an integer",
      "number.min": "Duration must be at least 1 year",
      "any.required": "Duration is required",
    }),
    startDate: Joi.date().required().messages({
      // "date.base": "Invalid date format for startDate",
      // "date.iso": "StartDate must be in ISO format",
      "any.required": "StartDate is required",
    }),
    annualAmount: Joi.number().positive().required().messages({
      "number.base": "Annual amount must be a number",
      "number.positive": "Annual amount must be a positive number",
      "any.required": "Annual amount is required",
    }),
    installmentType: Joi.string()
      .valid("Monthly", "Quarterly", "Annual", "Custom")
      .required()
      .messages({
        "any.only": "Invalid installment type",
        "any.required": "Installment type is required",
      }),
  });
};

export const updateShareDetailValidation = (shareDetails) => {
  return Joi.object({
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
};
