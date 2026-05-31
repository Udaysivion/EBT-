const express = require('express')
const router = express.Router()
const { readDB, writeDB, generateId } = require('./helpers')

router.get('/', (req, res) => {
  res.json(readDB().stats)
})

router.post('/', (req, res) => {
  const db = readDB()
  const stat = { id: generateId(), ...req.body }
  db.stats.push(stat)
  writeDB(db)
  res.status(201).json(stat)
})

router.put('/:id', (req, res) => {
  const db = readDB()
  const idx = db.stats.findIndex(s => s.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Stat not found' })
  db.stats[idx] = { ...db.stats[idx], ...req.body }
  writeDB(db)
  res.json(db.stats[idx])
})

router.delete('/:id', (req, res) => {
  const db = readDB()
  db.stats = db.stats.filter(s => s.id !== req.params.id)
  writeDB(db)
  res.json({ success: true })
})

module.exports = router
