// models/todoModel.js
import mongoose from "mongoose";
import Joi from "joi";

// Shareholder.js
const shareholderSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
    required: ["provide the phone number", true],
  },
  country: {
    type: String,
  },
  // Define other properties as needed
});

// Define a Joi schema for validation
export const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.number().required(),
  country: Joi.string().required(),
  // Define other validation rules for additional fields
});

export const Shareholder = mongoose.model("Shareholder", shareholderSchema);
