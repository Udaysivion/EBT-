const express = require('express')
const router = express.Router()
const { readDB, writeDB, generateId } = require('./helpers')

// GET all categories
router.get('/', (req, res) => {
  const db = readDB()
  res.json(db.menuCategories)
})

// GET single category
router.get('/:id', (req, res) => {
  const db = readDB()
  const cat = db.menuCategories.find(c => c.id === req.params.id)
  if (!cat) return res.status(404).json({ message: 'Category not found' })
  res.json(cat)
})

// POST new category
router.post('/', (req, res) => {
  const db = readDB()
  const newCat = { id: generateId(), items: [], ...req.body }
  db.menuCategories.push(newCat)
  writeDB(db)
  res.status(201).json(newCat)
})

// PUT update category (metadata only)
router.put('/:id', (req, res) => {
  const db = readDB()
  const idx = db.menuCategories.findIndex(c => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Category not found' })
  const { items, ...updates } = req.body
  db.menuCategories[idx] = { ...db.menuCategories[idx], ...updates }
  writeDB(db)
  res.json(db.menuCategories[idx])
})

// DELETE category
router.delete('/:id', (req, res) => {
  const db = readDB()
  db.menuCategories = db.menuCategories.filter(c => c.id !== req.params.id)
  writeDB(db)
  res.json({ success: true })
})

// POST add item to category
router.post('/:id/items', (req, res) => {
  const db = readDB()
  const cat = db.menuCategories.find(c => c.id === req.params.id)
  if (!cat) return res.status(404).json({ message: 'Category not found' })
  const newItem = { id: generateId(), ...req.body }
  cat.items.push(newItem)
  writeDB(db)
  res.status(201).json(newItem)
})

// PUT update item in category
router.put('/:catId/items/:itemId', (req, res) => {
  const db = readDB()
  const cat = db.menuCategories.find(c => c.id === req.params.catId)
  if (!cat) return res.status(404).json({ message: 'Category not found' })
  const itemIdx = cat.items.findIndex(i => i.id === req.params.itemId)
  if (itemIdx === -1) return res.status(404).json({ message: 'Item not found' })
  cat.items[itemIdx] = { ...cat.items[itemIdx], ...req.body }
  writeDB(db)
  res.json(cat.items[itemIdx])
})

// DELETE item from category
router.delete('/:catId/items/:itemId', (req, res) => {
  const db = readDB()
  const cat = db.menuCategories.find(c => c.id === req.params.catId)
  if (!cat) return res.status(404).json({ message: 'Category not found' })
  cat.items = cat.items.filter(i => i.id !== req.params.itemId)
  writeDB(db)
  res.json({ success: true })
})

module.exports = router
