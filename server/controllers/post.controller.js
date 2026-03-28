'use strict'

const { PostService } = require('../services/post.service')
const { ApiResponse } = require('../utils/ApiResponse')
const { asyncHandler } = require('../middlewares/asyncHandler')

const getAll = asyncHandler(async (req, res) => {
  const result = await PostService.getAll(req.query)
  res.status(200).json(ApiResponse.ok(result))
})

const getById = asyncHandler(async (req, res) => {
  const post = await PostService.getById(req.params.id)
  res.status(200).json(ApiResponse.ok(post))
})

const create = asyncHandler(async (req, res) => {
  const post = await PostService.create(req.user.id, req.body)
  res.status(201).json(ApiResponse.created(post))
})

const update = asyncHandler(async (req, res) => {
  const post = await PostService.update(req.params.id, req.body)
  res.status(200).json(ApiResponse.ok(post, 'Updated successfully'))
})

const remove = asyncHandler(async (req, res) => {
  await PostService.delete(req.params.id)
  res.status(200).json(ApiResponse.ok(null, 'Deleted successfully'))
})

module.exports = { getAll, getById, create, update, remove }
