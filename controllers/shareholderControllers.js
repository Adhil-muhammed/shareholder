import { Shareholder, schema } from "../models/index.js";

export const createShareholders = async (req, res) => {
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
