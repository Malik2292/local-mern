const Joi = require("joi")

const schema = Joi.object({
  firstName: Joi.string().min(1).max(50).required().messages({
    // ... (existing messages)
  }),
  lastName: Joi.string(),
  username: Joi.string().alphanum().min(1).max(50).required().messages({
    // ... (existing messages)
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "one"] },
    })
    .required()
    .messages({
      // ... (existing messages)
    }),
  password: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
    .messages({
      // ... (existing messages)
    }),
  checkCities: Joi.array().items(Joi.string()).unique().min(1).messages({
    "array.base": "checkCities must be an array of strings.",
    "array.unique": "All selected cities must be unique.",
    "array.min": "At least one city must be selected.",
  }),
})

module.exports = schema
