'use strict'

const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose')
require('dotenv').config()

const v1Routes = require('./routes/v1')
const { errorHandler } = require('./middlewares/errorHandler')
const { ApiError } = require('./utils/ApiError')

const app = express()
const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/demo'

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))

// Rate limiting
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
}))

// API version routing
app.use('/api/v1', v1Routes)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((_req, _res, next) => {
  next(new ApiError(404, 'Route not found'))
})

// Centralized error handler (must be last)
app.use(errorHandler)

// Connect to MongoDB and start server
let server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
      console.log(`API base: http://localhost:${PORT}/api/v1`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down gracefully...')
  if (server) server.close()
  await mongoose.disconnect()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

module.exports = { app }
