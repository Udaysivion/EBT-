const fs = require('fs')
const path = require('path')

const DB_PATH = path.join(__dirname, '../data/db.json')

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

module.exports = { readDB, writeDB, generateId }
