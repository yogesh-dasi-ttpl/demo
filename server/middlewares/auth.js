'use strict'

const jwt = require('jsonwebtoken')
const { ApiError } = require('../utils/ApiError')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

const authenticate = (req, _res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.badRequest('Missing or invalid Authorization header'))
  }

  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token'))
  }
}

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'))
  }
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Insufficient permissions'))
  }
  next()
}

module.exports = { authenticate, authorize, JWT_SECRET }
