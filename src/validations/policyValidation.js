// src/validations/policyValidation.js
const Joi = require('joi');

const policySchema = Joi.object({
  title: Joi.string().required().min(2).max(100),
  description: Joi.string().required(),
  content: Joi.string().required(),
  category_id: Joi.number().required(),
  image_url: Joi.string().uri(),
  color_from: Joi.string(),
  color_to: Joi.string(),
  objectives: Joi.array().items(
    Joi.object({
      objective: Joi.string().required()
    })
  ),
  implementations: Joi.array().items(
    Joi.object({
      step: Joi.string().required(),
      progress: Joi.number().min(0).max(100)
    })
  )
});

module.exports = { policySchema };

