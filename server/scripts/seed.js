'use strict'

/**
 * ===========================================
 *  DEV SEED CREDENTIALS
 * ===========================================
 *  Admin:     admin@example.com     / password123
 *  Moderator: moderator@example.com / password123
 *  Users:     user0@example.com ... user17@example.com / password123
 *
 *  Posts: 30 posts across all users with mixed statuses
 * ===========================================
 */

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { faker } = require('@faker-js/faker')
const { User } = require('../models/User')
const { Post } = require('../models/Post')

require('dotenv').config()

const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/demo'
const BCRYPT_ROUNDS = 12
const SEED_PASSWORD = 'password123'

const seed = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('Refusing to seed in production. Set NODE_ENV to something else.')
    process.exit(1)
  }

  await mongoose.connect(MONGO_URI)
  const sanitizedUri = MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
  console.log(`Connected to MongoDB: ${sanitizedUri}`)

  // Clear existing data only with --fresh flag
  const isFresh = process.argv.includes('--fresh')
  if (isFresh) {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      await collections[key].deleteMany({})
    }
    console.log('Cleared existing data')
  }

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, BCRYPT_ROUNDS)

  // --- Admin user ---
  const admin = await User.create({
    email: 'admin@example.com',
    passwordHash,
    profile: { name: 'Admin User', avatarUrl: faker.image.avatar() },
    role: 'admin',
    isActive: true,
    lastLoginAt: faker.date.recent({ days: 3 }),
  })
  console.log(`Created admin: ${admin.email}`)

  // --- Moderator user ---
  const moderator = await User.create({
    email: 'moderator@example.com',
    passwordHash,
    profile: { name: 'Mod User', avatarUrl: faker.image.avatar() },
    role: 'moderator',
    isActive: true,
    lastLoginAt: faker.date.recent({ days: 7 }),
  })
  console.log(`Created moderator: ${moderator.email}`)

  // --- Regular users (18 users) ---
  const users = []
  for (let i = 0; i < 18; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    users.push({
      email: `user${i}@example.com`,
      passwordHash,
      profile: {
        name: `${firstName} ${lastName}`,
        avatarUrl: i % 3 === 0 ? null : faker.image.avatar(), // some without avatar
      },
      role: 'user',
      isActive: i < 15, // 3 inactive users for edge cases
      lastLoginAt: i < 12 ? faker.date.recent({ days: 30 }) : null, // some never logged in
    })
  }

  const createdUsers = await User.insertMany(users)
  console.log(`Created ${users.length} regular users (15 active, 3 inactive)`)

  // --- Posts (30 posts across all users) ---
  const allAuthors = [admin._id, moderator._id, ...createdUsers.map((u) => u._id)]
  const statuses = ['draft', 'published', 'archived']
  const tagPool = [
    'javascript', 'nodejs', 'mongodb', 'express', 'react',
    'typescript', 'api', 'tutorial', 'devops', 'testing',
  ]

  const posts = []
  for (let i = 0; i < 30; i++) {
    const numTags = faker.number.int({ min: 0, max: 4 })
    posts.push({
      title: faker.lorem.sentence({ min: 3, max: 10 }).slice(0, 200),
      content: faker.lorem.paragraphs({ min: 2, max: 5 }),
      author: faker.helpers.arrayElement(allAuthors),
      status: statuses[i % 3], // even distribution: 10 draft, 10 published, 10 archived
      tags: faker.helpers.arrayElements(tagPool, numTags),
      featuredImage: i % 4 === 0 ? null : faker.image.urlPicsumPhotos(),
    })
  }

  await Post.insertMany(posts)
  console.log(`Created ${posts.length} posts (10 draft, 10 published, 10 archived)`)

  console.log(`\nSeed complete! Total users: ${2 + users.length}, Total posts: ${posts.length}`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
