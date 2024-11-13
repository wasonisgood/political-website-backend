// src/validations/contactValidation.js
const Joi = require('joi');

const contactSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  message: Joi.string().required().min(10)
});

module.exports = { contactSchema };