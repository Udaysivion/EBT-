const express = require('express')
const router = express.Router()
const { readDB, writeDB, generateId } = require('./helpers')

router.get('/', (req, res) => {
  res.json(readDB().branches)
})

router.post('/', (req, res) => {
  const db = readDB()
  const branch = { id: generateId(), ...req.body }
  db.branches.push(branch)
  writeDB(db)
  res.status(201).json(branch)
})

router.put('/:id', (req, res) => {
  const db = readDB()
  const idx = db.branches.findIndex(b => b.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Branch not found' })
  db.branches[idx] = { ...db.branches[idx], ...req.body }
  writeDB(db)
  res.json(db.branches[idx])
})

router.delete('/:id', (req, res) => {
  const db = readDB()
  db.branches = db.branches.filter(b => b.id !== req.params.id)
  writeDB(db)
  res.json({ success: true })
})

module.exports = router
