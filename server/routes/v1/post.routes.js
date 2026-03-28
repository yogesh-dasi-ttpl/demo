'use strict'

const { Router } = require('express')
const postController = require('../../controllers/post.controller')
const { authenticate } = require('../../middlewares/auth')
const { validate } = require('../../middlewares/validate')
const { createPostSchema, updatePostSchema } = require('../../validations/post.validation')

const router = Router()

router
  .route('/')
  .get(postController.getAll)
  .post(authenticate, validate(createPostSchema), postController.create)

router
  .route('/:id')
  .get(postController.getById)
  .put(authenticate, validate(updatePostSchema), postController.update)
  .delete(authenticate, postController.remove)

module.exports = router
