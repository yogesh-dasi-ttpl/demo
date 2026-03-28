'use strict'

const { Schema, model } = require('mongoose')

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title must be 200 characters or fewer'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'archived'],
        message: 'Status must be one of: draft, published, archived',
      },
      default: 'draft',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    featuredImage: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Compound indexes for common query patterns
postSchema.index({ author: 1, status: 1 })
postSchema.index({ status: 1, createdAt: -1 })
postSchema.index({ tags: 1 })

const Post = model('Post', postSchema)

module.exports = { Post }
