const express = require('express')
const router = express.Router()
const { readDB, writeDB } = require('./helpers')

router.get('/', (req, res) => {
  res.json(readDB().franchise)
})

router.put('/', (req, res) => {
  const db = readDB()
  db.franchise = { ...db.franchise, ...req.body }
  writeDB(db)
  res.json(db.franchise)
})

module.exports = router
