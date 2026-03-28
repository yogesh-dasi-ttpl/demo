'use strict'

const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email must be a valid address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // never returned by default
    },
    profile: {
      name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name must be 100 characters or fewer'],
      },
      avatarUrl: {
        type: String,
        trim: true,
        default: null,
      },
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'user', 'moderator'],
        message: 'Role must be one of: admin, user, moderator',
      },
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,           // auto-manages createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// ------------------------------------------------------------------
// Compound indexes for common query patterns
// ------------------------------------------------------------------

// Filter active users by role (e.g. list all active moderators)
userSchema.index({ role: 1, isActive: 1 })

// Paginate / sort by newest first
userSchema.index({ createdAt: -1 })

// Look up recently active users
userSchema.index({ lastLoginAt: -1, isActive: 1 })

// ------------------------------------------------------------------
// Virtuals
// ------------------------------------------------------------------

userSchema.virtual('fullName').get(function () {
  return this.profile?.name ?? ''
})

// ------------------------------------------------------------------
// Export
// ------------------------------------------------------------------

const User = model('User', userSchema)

module.exports = { User }
