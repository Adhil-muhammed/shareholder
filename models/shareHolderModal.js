// models/todoModel.js
import Joi from "joi";
import mongoose from "mongoose";

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
  country: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.number().min(10).required(),
  // Define other validation rules for additional fields
});

export const Shareholder = mongoose.model("Shareholder", shareholderSchema);
