'use strict'

const Joi = require('joi')

const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid address',
    'any.required': 'Email is required',
  }),
  passwordHash: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
  profile: Joi.object({
    name: Joi.string().max(100).required().messages({
      'any.required': 'Name is required',
      'string.max': 'Name must be 100 characters or fewer',
    }),
    avatarUrl: Joi.string().uri().allow(null, '').optional(),
  }).required(),
  role: Joi.string().valid('admin', 'user', 'moderator').optional(),
})

const updateUserSchema = Joi.object({
  profile: Joi.object({
    name: Joi.string().max(100).optional(),
    avatarUrl: Joi.string().uri().allow(null, '').optional(),
  }).optional(),
  isActive: Joi.boolean().optional(),
  lastLoginAt: Joi.date().allow(null).optional(),
}).min(1).messages({
  'object.min': 'At least one field is required for update',
})

module.exports = { createUserSchema, updateUserSchema }
