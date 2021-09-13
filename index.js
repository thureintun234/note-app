const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./models/note')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())


// morgon token customize
morgan.token('data', (req, res) => {
  return JSON.stringify(req.body)
})

// morgon logger
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :data')
app.use(logger)

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id).then(note => {
    res.json(note)
  })
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(n => n.id !== id)

  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note.save().then(savedNote => {
    res.json(savedNote)
  })
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})