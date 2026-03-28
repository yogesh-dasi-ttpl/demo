'use strict'

const { Post } = require('../models/Post')
const { ApiError } = require('../utils/ApiError')
const { escapeRegex } = require('../utils/escapeRegex')

const ALLOWED_SORTS = ['-createdAt', 'createdAt', '-updatedAt', 'updatedAt', 'title', '-title']
const MAX_LIMIT = 100

class PostService {
  async getAll(query = {}) {
    const { sort = '-createdAt', status, author, tags, search } = query

    const page = Math.max(1, parseInt(query.page, 10) || 1)
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit, 10) || 10))
    const safeSort = ALLOWED_SORTS.includes(sort) ? sort : '-createdAt'

    const filter = {}
    if (status) filter.status = status
    if (author) filter.author = author
    if (tags) filter.tags = { $in: Array.isArray(tags) ? tags : [tags] }
    if (search) {
      const safeSearch = escapeRegex(search)
      filter.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { content: { $regex: safeSearch, $options: 'i' } },
      ]
    }

    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'email profile')
        .sort(safeSort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
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
    const post = await Post.findById(id)
      .populate('author', 'email profile')
      .lean()
    if (!post) throw ApiError.notFound('Post not found')
    return post
  }

  async create(authorId, payload) {
    const { title, content, status, tags, featuredImage } = payload
    const post = await Post.create({ title, content, status, tags, featuredImage, author: authorId })
    return post.toObject()
  }

  async update(id, payload) {
    const { title, content, status, tags, featuredImage } = payload
    const update = {}
    if (title !== undefined) update.title = title
    if (content !== undefined) update.content = content
    if (status !== undefined) update.status = status
    if (tags !== undefined) update.tags = tags
    if (featuredImage !== undefined) update.featuredImage = featuredImage

    const post = await Post.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean()
    if (!post) throw ApiError.notFound('Post not found')
    return post
  }

  async delete(id) {
    const post = await Post.findByIdAndDelete(id)
    if (!post) throw ApiError.notFound('Post not found')
    return post
  }
}

module.exports = { PostService: new PostService() }
