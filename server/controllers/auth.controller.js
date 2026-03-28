'use strict'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { ApiError } = require('../utils/ApiError')
const { ApiResponse } = require('../utils/ApiResponse')
const { JWT_SECRET } = require('../middlewares/auth')

const login = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(ApiError.badRequest('Email and password are required'))
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash')
  if (!user) {
    return next(new ApiError(401, 'Invalid email or password'))
  }

  if (!user.isActive) {
    return next(new ApiError(403, 'Account is deactivated'))
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) {
    return next(new ApiError(401, 'Invalid email or password'))
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  user.lastLoginAt = new Date()
  await user.save()

  res.json(new ApiResponse(200, {
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.profile.name,
      role: user.role,
      avatarUrl: user.profile.avatarUrl,
    },
  }, 'Login successful'))
}

const me = async (req, res, next) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    return next(new ApiError(404, 'User not found'))
  }

  res.json(new ApiResponse(200, {
    id: user._id,
    email: user.email,
    name: user.profile.name,
    role: user.role,
    avatarUrl: user.profile.avatarUrl,
  }))
}

module.exports = { login, me }
