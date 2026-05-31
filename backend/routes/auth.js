const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'ebt_super_secret_2024'

// ── Default admin credentials ─────────────────────────────
// Change these in production via environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ebt@2024'

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body || {}

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' })
    }

    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { username: username.trim(), role: 'admin' },
        SECRET,
        { expiresIn: '24h' }
      )
      return res.json({ success: true, token })
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials. Use admin / ebt@2024' })
  } catch (err) {
    console.error('[Auth] Login error:', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

// GET /api/auth/verify
router.get('/verify', (req, res) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false, message: 'No token provided' })
  }
  const token = auth.split(' ')[1]
  try {
    const decoded = jwt.verify(token, SECRET)
    res.json({ valid: true, user: decoded })
  } catch {
    res.status(401).json({ valid: false, message: 'Invalid or expired token' })
  }
})

module.exports = router
