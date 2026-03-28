'use strict'

const { UserService } = require('../services/user.service')
const { ApiResponse } = require('../utils/ApiResponse')
const { asyncHandler } = require('../middlewares/asyncHandler')

const getAll = asyncHandler(async (req, res) => {
  const result = await UserService.getAll(req.query)
  res.status(200).json(ApiResponse.ok(result))
})

const getById = asyncHandler(async (req, res) => {
  const user = await UserService.getById(req.params.id)
  res.status(200).json(ApiResponse.ok(user))
})

const create = asyncHandler(async (req, res) => {
  const user = await UserService.create(req.body)
  res.status(201).json(ApiResponse.created(user))
})

const update = asyncHandler(async (req, res) => {
  const user = await UserService.update(req.params.id, req.body)
  res.status(200).json(ApiResponse.ok(user, 'Updated successfully'))
})

const remove = asyncHandler(async (req, res) => {
  await UserService.delete(req.params.id)
  res.status(200).json(ApiResponse.ok(null, 'Deleted successfully'))
})

module.exports = { getAll, getById, create, update, remove }
