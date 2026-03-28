'use strict'

const { ApiError } = require('../utils/ApiError')

const errorHandler = (err, req, res, _next) => {
  let error = err

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`)
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    error = ApiError.conflict(`${field} already exists`)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message)
    error = ApiError.badRequest('Validation failed', errors)
  }

  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal server error'

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  })
}

module.exports = { errorHandler }
