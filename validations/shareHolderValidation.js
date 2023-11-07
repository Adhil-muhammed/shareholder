import Joi from "joi";

export const shareholderValidationSchema = () => {
  return Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email(),
    phone: Joi.string()
      .pattern(new RegExp(/^\d{10}$/))
      .required()
      .messages({
        "any.required": "Please provide the phone number",
        "string.pattern.base": "Phone number must be a 10-digit number",
      }),
    country: Joi.string().optional(),
  });
};
