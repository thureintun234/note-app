const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./models/note')

// morgon token customize
morgan.token('data', (req, res) => {
  return JSON.stringify(req.body)
})

// morgon logger
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :data')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(logger)


app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.post('/api/notes', (req, res, next) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note.save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndFormatedNote => res.json(savedAndFormatedNote))
    .catch(err => next(err))
})

app.put('/api/notes/:id', (req, res, next) => {
  const body = req.body

  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(err => next(err))
})

// unknown enpoint middleware
const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndPoint)


// malformateed id middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})