'use strict'

const { Router } = require('express')
const userController = require('../../controllers/user.controller')
const { authenticate, authorize } = require('../../middlewares/auth')
const { validate } = require('../../middlewares/validate')
const { createUserSchema, updateUserSchema } = require('../../validations/user.validation')

const router = Router()

router
  .route('/')
  .get(userController.getAll)
  .post(authenticate, authorize('admin'), validate(createUserSchema), userController.create)

router
  .route('/:id')
  .get(userController.getById)
  .put(authenticate, validate(updateUserSchema), userController.update)
  .delete(authenticate, authorize('admin'), userController.remove)

module.exports = router
