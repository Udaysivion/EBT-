const express = require('express')
const router = express.Router()
const { readDB, writeDB, generateId } = require('./helpers')

router.get('/', (req, res) => {
  res.json(readDB().specials)
})

router.post('/', (req, res) => {
  const db = readDB()
  const item = { id: generateId(), ...req.body }
  db.specials.push(item)
  writeDB(db)
  res.status(201).json(item)
})

router.put('/:id', (req, res) => {
  const db = readDB()
  const idx = db.specials.findIndex(s => s.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Special not found' })
  db.specials[idx] = { ...db.specials[idx], ...req.body }
  writeDB(db)
  res.json(db.specials[idx])
})

router.delete('/:id', (req, res) => {
  const db = readDB()
  db.specials = db.specials.filter(s => s.id !== req.params.id)
  writeDB(db)
  res.json({ success: true })
})

module.exports = router
