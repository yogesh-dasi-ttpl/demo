'use strict'

const { User } = require('../models/User')
const { ApiError } = require('../utils/ApiError')
const { escapeRegex } = require('../utils/escapeRegex')

const ALLOWED_SORTS = ['-createdAt', 'createdAt', '-updatedAt', 'updatedAt', 'email', '-email']
const MAX_LIMIT = 100

class UserService {
  async getAll(query = {}) {
    const { sort = '-createdAt', role, isActive, search } = query

    const page = Math.max(1, parseInt(query.page, 10) || 1)
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit, 10) || 10))
    const safeSort = ALLOWED_SORTS.includes(sort) ? sort : '-createdAt'

    const filter = {}
    if (role) filter.role = role
    if (isActive !== undefined) filter.isActive = isActive === 'true'
    if (search) {
      const safeSearch = escapeRegex(search)
      filter.$or = [
        { email: { $regex: safeSearch, $options: 'i' } },
        { 'profile.name': { $regex: safeSearch, $options: 'i' } },
      ]
    }

    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      User.find(filter).sort(safeSort).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ])

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getById(id) {
    const user = await User.findById(id).lean()
    if (!user) throw ApiError.notFound('User not found')
    return user
  }

  async create(payload) {
    const { email, passwordHash, profile } = payload
    const existing = await User.findOne({ email }).lean()
    if (existing) throw ApiError.conflict('Email already exists')
    const user = await User.create({ email, passwordHash, profile })
    const result = user.toObject()
    delete result.passwordHash
    return result
  }

  async update(id, payload) {
    const { profile, isActive, lastLoginAt } = payload
    const update = {}
    if (profile) update.profile = profile
    if (isActive !== undefined) update.isActive = isActive
    if (lastLoginAt !== undefined) update.lastLoginAt = lastLoginAt

    const user = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean()
    if (!user) throw ApiError.notFound('User not found')
    return user
  }

  async delete(id) {
    const user = await User.findByIdAndDelete(id)
    if (!user) throw ApiError.notFound('User not found')
    return user
  }
}

module.exports = { UserService: new UserService() }
