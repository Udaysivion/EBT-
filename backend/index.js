const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const authRoutes     = require('./routes/auth')
const menuRoutes     = require('./routes/menu')
const branchRoutes   = require('./routes/branches')
const statsRoutes    = require('./routes/stats')
const specialsRoutes = require('./routes/specials')
const franchiseRoutes = require('./routes/franchise')
const { readDB, writeDB } = require('./routes/helpers')

const app    = express()
const PORT   = process.env.PORT || 3001
const SECRET = process.env.JWT_SECRET || 'ebt_super_secret_2024'

// ── CORS ──────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── Body parsing with error handler ──────────────────────
app.use(express.json())
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' })
  }
  next(err)
})

// ── Auth middleware ───────────────────────────────────────
function requireAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }
  const token = auth.split(' ')[1]
  try {
    req.user = jwt.verify(token, SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token — please log in again' })
  }
}

// ── Auth (public) ─────────────────────────────────────────
app.use('/api/auth', authRoutes)

// ── Public read-only routes (used by the frontend website) ─
app.get('/api/menu',      (req, res) => res.json(readDB().menuCategories))
app.get('/api/menu/:id',  (req, res) => {
  const cat = readDB().menuCategories.find(c => c.id === req.params.id)
  cat ? res.json(cat) : res.status(404).json({ message: 'Category not found' })
})
app.get('/api/branches',  (req, res) => res.json(readDB().branches))
app.get('/api/stats',     (req, res) => res.json(readDB().stats))
app.get('/api/specials',  (req, res) => res.json(readDB().specials))
app.get('/api/franchise', (req, res) => res.json(readDB().franchise))
app.get('/api/hero',      (req, res) => res.json(readDB().heroImages))

// ── Protected admin CRUD routes ───────────────────────────
app.use('/api/admin/menu',      requireAuth, menuRoutes)
app.use('/api/admin/branches',  requireAuth, branchRoutes)
app.use('/api/admin/stats',     requireAuth, statsRoutes)
app.use('/api/admin/specials',  requireAuth, specialsRoutes)
app.use('/api/admin/franchise', requireAuth, franchiseRoutes)

app.put('/api/admin/hero', requireAuth, (req, res) => {
  const db = readDB()
  db.heroImages = req.body.heroImages || db.heroImages
  writeDB(db)
  res.json(db.heroImages)
})

// ── Contact Messages Routes (Public) ──────────────────────
app.post('/api/messages', (req, res) => {
  const { name, email, phone, subject, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' })
  }
  const db = readDB()
  if (!db.messages) db.messages = []
  
  const newMessage = {
    id: 'msg_' + Date.now(),
    name,
    email,
    phone: phone || '',
    subject: subject || '',
    message,
    status: 'unread', // 'unread' or 'read'
    createdAt: new Date().toISOString()
  }
  
  db.messages.unshift(newMessage)
  writeDB(db)
  res.status(201).json(newMessage)
})

// ── Contact Messages Routes (Admin - Protected) ───────────
app.get('/api/admin/messages', requireAuth, (req, res) => {
  const db = readDB()
  res.json(db.messages || [])
})

app.put('/api/admin/messages/:id', requireAuth, (req, res) => {
  const db = readDB()
  if (!db.messages) db.messages = []
  const msg = db.messages.find(m => m.id === req.params.id)
  if (!msg) {
    return res.status(404).json({ message: 'Message not found' })
  }
  
  msg.status = req.body.status || msg.status
  writeDB(db)
  res.json(msg)
})

app.delete('/api/admin/messages/:id', requireAuth, (req, res) => {
  const db = readDB()
  if (!db.messages) db.messages = []
  const index = db.messages.findIndex(m => m.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ message: 'Message not found' })
  }
  
  db.messages.splice(index, 1)
  writeDB(db)
  res.json({ message: 'Message deleted successfully' })
})

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), port: PORT })
})

// ── Global error handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`\n╔═══════════════════════════════════════════╗`)
  console.log(`║   🍽️  EBT Restaurant — Backend Server     ║`)
  console.log(`╠═══════════════════════════════════════════╣`)
  console.log(`║  URL:  http://localhost:${PORT}             ║`)
  console.log(`║  API:  http://localhost:${PORT}/api         ║`)
  console.log(`╠═══════════════════════════════════════════╣`)
  console.log(`║  Login:  admin  |  Pass: ebt@2024          ║`)
  console.log(`╚═══════════════════════════════════════════╝\n`)
})
