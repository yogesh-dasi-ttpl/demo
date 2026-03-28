'use strict'

const { Router } = require('express')
const userRoutes = require('./user.routes')
const postRoutes = require('./post.routes')

const router = Router()

router.use('/users', userRoutes)
router.use('/posts', postRoutes)

module.exports = router
