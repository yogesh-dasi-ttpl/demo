'use strict'

const { Router } = require('express')
const authRoutes = require('./auth.routes')
const userRoutes = require('./user.routes')
const postRoutes = require('./post.routes')

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/posts', postRoutes)

module.exports = router
