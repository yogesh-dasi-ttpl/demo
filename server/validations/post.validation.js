'use strict'

const Joi = require('joi')

const createPostSchema = Joi.object({
  title: Joi.string().max(200).required().messages({
    'any.required': 'Title is required',
    'string.max': 'Title must be 200 characters or fewer',
  }),
  content: Joi.string().required().messages({
    'any.required': 'Content is required',
  }),
  status: Joi.string().valid('draft', 'published', 'archived').optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  featuredImage: Joi.string().uri().allow(null, '').optional(),
})

const updatePostSchema = Joi.object({
  title: Joi.string().max(200).optional(),
  content: Joi.string().optional(),
  status: Joi.string().valid('draft', 'published', 'archived').optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  featuredImage: Joi.string().uri().allow(null, '').optional(),
}).min(1).messages({
  'object.min': 'At least one field is required for update',
})

module.exports = { createPostSchema, updatePostSchema }
