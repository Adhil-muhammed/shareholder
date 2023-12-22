import { Shareholder, schema } from "../models/index.js";
import { shareholderValidationSchema } from "../validations/index.js";

export const createShareholders = async (req, res) => {
  try {
    const isUniqueEmail = await Shareholder.exists({
      email: req?.body?.email,
    });
    const { error } = shareholderValidationSchema()?.validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    if (isUniqueEmail) {
      return res.status(409).json({ error: "email is not unique" });
    }
    // Create a new Shareholder instance
    const newShareholder = new Shareholder(req.body);
    // Save the shareholder to the database
    const savedUser = await newShareholder?.save();

    return res.json({ message: "Shareholder added successfully", savedUser });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add shareholder", message: error?.message });
  }
};

export const getShareholders = async (req, res) => {
  try {
    const shareholders = await Shareholder?.find();
    console.log("shareholders: ", shareholders);
    if (!shareholders?.length) {
      res
        .status(200)
        .json({ status: "No shareholder to list", message: error?.message });
    }

    res.status(200).json({ shareholders });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to list shareholders", message: error?.message });
  }
};
