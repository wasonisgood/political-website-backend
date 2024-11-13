// src/validations/activityValidation.js
const Joi = require('joi');

const activitySchema = Joi.object({
  title: Joi.string().required().min(2).max(100),
  description: Joi.string().required(),
  date: Joi.date().required(),
  time_start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  time_end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  location: Joi.string().required(),
  category_id: Joi.number().required(),
  image_url: Joi.string().uri(),
  external_link: Joi.string().uri(),
  agenda: Joi.array().items(
    Joi.object({
      time_slot: Joi.string().required(),
      description: Joi.string().required()
    })
  )
});

module.exports = { activitySchema };

