'use strict'

const { Router } = require('express')
const { login, me } = require('../../controllers/auth.controller')
const { authenticate } = require('../../middlewares/auth')
const asyncHandler = require('../../middlewares/asyncHandler')

const router = Router()

router.post('/login', asyncHandler(login))
router.get('/me', authenticate, asyncHandler(me))

module.exports = router
